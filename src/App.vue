<template>
  <nav>
    <div>
      <h2>Majornas</h2><div class="break"></div>
      <h2>Sommarbingo</h2>
    </div>
    
    <ul v-if="store.isAuth">
        <li><v-icon large @click="openInfo = true">mdi-information-outline</v-icon></li>
        <li><v-icon large @click="openStats = true">mdi-chart-box-outline</v-icon></li>
    </ul>
</nav>
<div class="main">
  <v-dialog v-model="openInfo" width="90%">
    <v-card>
      <v-btn
        icon="mdi-close"
        color="rgb(10, 150, 125)"
        @click="openInfo = false"
      ></v-btn>
      <v-card-text>
        <p>Här finns en lista som kan vara till hjälp när man inte fattar vad en ruta betyder.</p>
        <hr/>
        <div v-for="item in descriptions">
          <h3 v-if="item.description != null || item.situated != null">{{ item.item }}</h3>
          <p v-if="item.description != null">{{ item.description }}</p>
          <p v-if="item.situated != null"><Map :coordinates="item.situated" class="map"/></p>
          <hr v-if="item.description != null || item.situated != null"/>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="openStats" width="90%">
    <v-btn
        color="rgb(10, 150, 125)"
        icon="mdi-close"
        @click="openStats = false"
      ></v-btn>
    <v-card>
      <v-card-text>
        <div><Statistics/></div>
      </v-card-text>
    </v-card>
  </v-dialog>
  <RouterView  >
    <Login v-if="!uid"/>
    <HomeView v-if="uid" :key="componentKey"/>
  </RouterView>
</div>
<footer>
    <p><em>© 2024 Majornas Sommarbingo</em>. <a href="https://github.com/kikkipedia/MajornaBingo" target="_blank">Checkout the code</a></p> 
    <p>Idé av Sikas. Kod av Kicki. <strike>Tack Alex!</strike><br/>Rapportera gärna fel via sms: <a href="sms:+46762100615">0762100615</a></p>
</footer>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useBingoStore } from './stores';
import { watch, ref, onMounted } from 'vue';
import {getBingoItems} from './db'
import { type BingoItem } from './types';
import Statistics from './components/Statistics.vue';
import Login from './components/Login.vue';
import HomeView from './components/HomeView.vue';
import Map from './components/Map.vue';

const store = useBingoStore()
const name = ref('')

const openInfo = ref(false)
const openStats = ref(false)
const openMap = ref(false)  
const descriptions = ref<BingoItem[]>([]) //BingoItems from database
const componentKey = ref(0)

//get name from store
watch(() => store.name, (nam) => {
name.value = nam

})

watch(() => store.isAuth, () => {
componentKey.value++
})

const uid = localStorage.getItem('userId')

//sort by description.name in ascending order
const sortItems = (): BingoItem[] => {
descriptions.value.sort((a, b) => a.item.localeCompare(b.item))
return descriptions.value
}

onMounted(async () => {
const items = await getBingoItems()
descriptions.value = items
sortItems()
})

</script>

<style scoped>
nav {
justify-content: space-between;
line-height: 1;
color: #d8f3dc;
margin: auto;
display: flex;
flex-wrap: wrap;
margin-left: 10px;
background-color: #40916c;
}

.mdi:before, .mdi-set {
font-size: 2rem;

}
ul {
list-style-type: none;
margin: 0;
padding: 0;
overflow: hidden;
float: right;
display: flex;
}

li {
list-style: none;
cursor: pointer;
padding: 0.2rem;
float: right;
}

.break { 
  flex-basis: 50%;
  height: 0;
}

.main {
background-color: white;
margin-top: 10px;
min-height: calc(100vh - 140px) !important;
margin: 0 10px;
}

footer {
text-align: center;
bottom: 0;
width: 100% !important;
font-size: 0.8rem;
color: #d8f3dc;
background-color: #40916c;
margin: auto;
}

footer a {
color: rgb(116, 0, 255);
}

h4 {
font-size: 0.8rem;
font-weight: bold;
color: #d8f3dc;
padding-top: 5px
}

.v-icon {
--v-icon-size-multiplier: 2;
}

h3 {
font-size: 1rem;
color: rgb(0, 189, 255);;
}

.map {
max-height: 300px;
padding-bottom: 10px;
}
</style>