<template>
    <div class="container">
        <v-form @submit.prevent="resetPswd" v-if="!sent">
            <v-text-field
                v-model="email"
                label="Email"
                required
                color="#7400FF"
            ></v-text-field>
            <v-btn type="submit" color="#7400FF">Reset password</v-btn>
        </v-form>
        <div v-else>
            <p>Kolla din inbox för att fixa nytt lösen!</p>
            <v-btn
                color="#7400FF"
                @click="$router.push('/')"
            >
                Login
            </v-btn>
        </div>     
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getAuth } from 'firebase/auth';
import { sendPasswordResetEmail } from 'firebase/auth';

const email = ref('');
const sent = ref(false);

const resetPswd = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email.value)
        .then(() => {
            sent.value = true;
        })
}

</script>

<style scoped>
.container {
    align-items: center;
    text-align: center;
    padding-top: 1rem;
    margin: 0 auto;
    width: 100%;
}

p {
    color: #7400FF;
    font-size: 1.5rem;
    margin-top: 1rem;
}

.v-btn {
    margin-top: 1rem;
}
</style>