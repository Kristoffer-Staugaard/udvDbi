<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useScheduleStore } from '@/stores/ScheduleStore';
import { useAuthStore } from '@/stores/AuthStore';
import { useObjectStore } from '@/stores/ObjectStore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/configs/firebase';
import { useRouter } from 'vue-router';

const scheduleStore = useScheduleStore();
const authStore = useAuthStore();
const objectStore = useObjectStore();
const router = useRouter();

const title = ref('');
const date = ref('');
const errorComment = ref('');
const errorStatus = ref('');
const systemComment = ref('');
const systemStatus = ref('');
const selectedObject = ref('');
const taskId = ref('');

const route = useRoute();

onMounted(async () => {
  await scheduleStore.fetchTasks();

  const idFromRoute = route.params.id;
  const matchingTask = scheduleStore.tasks.find(task => task.id === idFromRoute);

  if (matchingTask) {
    taskId.value = matchingTask.id;
    title.value = matchingTask.title || '';
    date.value = matchingTask.deadline instanceof Date
      ? matchingTask.deadline.toISOString().split('T')[0]
      : matchingTask.deadline || '';
    selectedObject.value = matchingTask.object || '';
    errorComment.value = matchingTask.errorComment || '';
    errorStatus.value = matchingTask.errorStatus || '';
    systemComment.value = matchingTask.systemComment || '';
    systemStatus.value = matchingTask.systemStatus || '';
  } else {
    console.warn('Ingen matching task fundet for id:', idFromRoute);
  }
});

const saveTemporary = async () => {
  const uid = authStore.user?.uid;
  if (!uid || !taskId.value) {
    console.error('Bruger ikke logget ind eller taskId mangler');
    return;
  }

  try {
    const docRef = doc(db, 'ScheduleForm', taskId.value);
    await updateDoc(docRef, {
      title: title.value,
      deadline: date.value,
      errorComment: errorComment.value,
      errorStatus: errorStatus.value,
      status: 'Igangværende',
      systemComment: systemComment.value,
      systemStatus: systemStatus.value,
      uid: uid
    });
    window.alert('Data opdateret (midlertidig).');
    router.push('/Schedule');
  } catch (err) {
    console.error('Fejl ved opdatering:', err);
  }
};

const saveAndClose = async () => {
  const uid = authStore.user?.uid;
  if (!uid || !taskId.value) {
    console.error('Bruger ikke logget ind eller taskId mangler');
    return;
  }

  try {
    const docRef = doc(db, 'ScheduleForm', taskId.value);
    await updateDoc(docRef, {
      title: title.value,
      deadline: date.value,
      errorComment: errorComment.value,
      errorStatus: errorStatus.value,
      status: 'Udført',
      systemComment: systemComment.value,
      systemStatus: systemStatus.value,
      uid: uid,
      object: selectedObject.value
    });
    window.alert('Data opdateret og sendt.');
    router.push('/Schedule');
  } catch (err) {
    console.error('Fejl ved opdatering:', err);
  }
};
</script>

<template>
  <div class="schedule-form">
    <form class="schedule-form__formular">
      <div class="schedule-form__formular-item">
        <h3> {{ title }}</h3>

        <div class="schedule-form__formular-item-date">
          <div class="schedule-form__label-date">
            <p class="p1">Dato:</p>
            <p class="schedule-form__readonly-text">{{ date }}</p>
          </div>

          <div class="schedule-form__label-date">
            <p class="p1">Objekt:</p>
            <p class="schedule-form__readonly-text">
              {{ objectStore.objects.find(obj => obj.id === selectedObject)?.object }} -
              {{ objectStore.objects.find(obj => obj.id === selectedObject)?.location }}
            </p>
          </div>
        </div>
      </div>

      <div class="schedule-form__formular-item">
        <h3>Alle systemdele er tilkoblet og funktionsdygtige</h3>
        <label class="p1">
          <input class="schedule-form__checkbox-input" type="radio" v-model="errorStatus" value="yes" /> Ja
        </label>
        <label class="p1">
          <input class="schedule-form__checkbox-input" type="radio" v-model="errorStatus" value="no" /> Nej
        </label>

        <label class="p1" for="errorComment">Kommentar til fejlstatus</label>
        <textarea type="text" v-model="errorComment"></textarea>
      </div>

      <div class="schedule-form__formular-item">
        <h3>Fejlmeldinger udbedret</h3>
        <label class="p1">
          <input class="schedule-form__checkbox-input" type="radio" v-model="systemStatus" value="yes" /> Ja
        </label>
        <label class="p1">
          <input class="schedule-form__checkbox-input" type="radio" v-model="systemStatus" value="no" /> Nej
        </label>
        <label class="p1" for="systemComment">Kommentar til systemstatus</label>
        <textarea type="text" v-model="systemComment"></textarea>
      </div>

      <div class="schedule-form__button">
        <button class="p1 p-white schedule-form__button--save" type="button" @click="saveAndClose">Gem og luk</button>
        <button class="p1 p-blue schedule-form__button--save-temporary" type="button" @click="saveTemporary">Gem midlertidig</button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/main.scss" as v;

.schedule-form {
    background-color: v.$white;
    border-radius: 1.5em;
    padding: 4.375rem;

    &__formular {
        display: flex;
        flex-direction: column;
        gap: 7em;

        &-item {
            display: flex;
            flex-direction: column;
            gap: 1em;

            &-date {
                display: flex;
                flex-direction: column;
            }
        }
    }

    &__label-date {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1em;
    }

    &__readonly-text {
        font-family: v.$main-font;
        font-size: 25px;
        font-weight: 200;
        color: v.$dark-grey;
        margin: 0;
        padding: 0.5em 0;
    }

    &__button {
        display: flex;
        gap: 1em;

        &--save {
            background-color: v.$main-blue;
            border-radius: 0.5em;
            border-style: none;
            padding: 0.5em;
            transition: all 0.3s ease;
            cursor: pointer;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(43, 115, 147, 0.2);
                background-color: darken(v.$main-blue, 5%);
            }

            &:active {
                transform: translateY(0);
            }
        }

        &--save-temporary {
            background-color: v.$white;
            border-color: v.$main-blue;
            border-radius: 0.5em;
            border-style: solid;
            padding: 0.5em;
            transition: all 0.3s ease;
            cursor: pointer;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(43, 115, 147, 0.1);
                background-color: rgba(43, 115, 147, 0.05);
            }

            &:active {
                transform: translateY(0);
            }
        }
    }
}

textarea {
    border-color: #2B7393;
    border-radius: 0.5em;
    border-style: solid;
    resize: none;
    height: 6em;
    border-radius: 1.5em;
    padding: 1.5em;
    vertical-align: top;
}

label {
    box-sizing: border-box;
    margin-bottom: 1em;
    width: calc(33.333% - 0.667em);
    display: flex;
    gap: .5em;
    border-radius: 50%;
    flex-direction: row;
    align-items: center;
}

.schedule-form__checkbox-input {
    appearance: none;
    border: 2px solid v.$main-blue;
    border-radius: 50%;
    height: 2.5em;
    margin: 0;
    width: 2.5em;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
    background-color: white;

    &:checked {
        background-color: white;
        &::after {
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 1.2em;
            height: 1.2em;
            background-color: v.$main-blue;
            border-radius: 50%;
        }
    }

    &:hover {
        border-color: darken(v.$main-blue, 10%);
    }
}
</style>
