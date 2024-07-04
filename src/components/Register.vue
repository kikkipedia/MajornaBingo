<template>
    <div class="register">
        <v-snackbar v-model="showSnackbar" color="success">
        Email verification sent to {{ email }}. Please verify your email before logging in.
        <template v-slot:actions>
        <v-btn
          color="red"
          variant="text"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
        <v-form @submit.prevent>
        <v-text-field
            solo dense
            label="Namn"
            placeholder="Ange bingonamn"
            :rules="[rules.required]"
            v-model="userName"
        >
        </v-text-field>
        <v-text-field
            solo dense
            label="Email"
            placeholder="Ange emailadress"
            type="email"
            :rules="[rules.required]"
            v-model="email"
        >
        </v-text-field>
        <v-text-field
            solo dense
            label="Lösenord"
            placeholder="Ange lösenord"
            type="password"
            :rules="[rules.required]"
            v-model="password"
        >
        </v-text-field>
        <v-btn :disabled="!userName" color="#7400FF" class="mt-2" type="submit" block @click="userSubmit">Registrera</v-btn>
    </v-form>
    
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useBingoStore } from '@/stores';
import  router from '@/router';
import { saveNewUser } from '@/db';

const email = ref('');
const userName = ref();
const password = ref('');
const userCredentials = ref();
const showSnackbar = ref(false);

const error = ref(null);

const store = useBingoStore();

interface Rules {
    required: (value: any) => boolean | string;
}

const rules: Rules = {
    required: (value) => !!value || 'Field is required',
};

const saveUserInDb = async(id: string) =>{
    //save new user in db
    const response = await saveNewUser(id, userName.value)
    localStorage.setItem('userId', response)
}


const userSubmit = async () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        //save as post in db
        saveUserInDb(user.uid)
        sendEmail()
        setUser()
        localStorage.setItem('userId', user.uid);
  })
  .catch((error) => {
    error.code;
    error.value = error.message;
    // TODO show error message
  });
    
}   

const sendEmail = () => {
    const actionCodeSettings = {
        url: 'http://kvillebingo.web.app/', //todo change to production url
        handleCodeInApp: true,
    };
    const auth = getAuth();
    //send email verification
    if (auth.currentUser) {
        sendEmailVerification(auth.currentUser, actionCodeSettings)
        .then(() => {
            console.log('Email verification sent');
            showSnackbar.value = true; //todo show in middle of screen
            router.push('/');
     });
    }
}

const setUser = () => {
    //set in local storage and store
    localStorage.setItem('userName', userName.value);
    store.setName(userName.value);
    //todo set userId
}



</script>

<style scoped>

.register {
    text-align: center;
    max-width: 100%;
    margin: 0 auto;
}

.bingologo {
    width: 150px;
    margin-top: 20px;
}
</style>