<template>
    <div class="bingoSheet" v-show="bingoId">
        <ConfettiExplosion v-if="confetti" :particleSize="10" :duration="1500" :colors="colors"/>
             <table>
                <tr>
                    <td v-for="doc, index in row1" :key="doc.id" @click="bingoClick(index, 1, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row2" :key="doc.id" @click="bingoClick(index, 2, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row3" :key="doc.id" @click="bingoClick(index, 3, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row4" :key="doc.id" @click="bingoClick(index, 4, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row5" :key="doc.id" @click="bingoClick(index, 5, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row6" :key="doc.id" @click="bingoClick(index, 6, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row7" :key="doc.id" @click="bingoClick(index, 7, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row8" :key="doc.id" @click="bingoClick(index, 8, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row9" :key="doc.id" @click="bingoClick(index, 9, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
                <tr>
                    <td v-for="doc, index in row10" :key="doc.id" @click="bingoClick(index, 10, doc.id)" v-bind:class="[doc.isChecked ? 'checked' : 'unchecked']">{{ doc.item }}</td>
                </tr>
            </table>
            <!-- Bingo Popup -->
            <v-overlay v-model="overlay" class="overlay">
                <ConfettiExplosion v-if="explode" :particleSize="15" :duration="2000" :colors="colors" :particleCount="200"/>
                <v-card
                    class="mx-auto my-8 bingocard"
                    elevation="16"
                >
                <span class="animate__animated animate__bounceIn">BINGO!</span>
                </v-card>
            </v-overlay>
        </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { type BingoItem } from '@/types';
import { minusBingoItemCount, updateBingoItemCount, updateSheetInDb, updateUserScore } from '@/db';
import { useBingoStore } from '@/stores';
import ConfettiExplosion from "vue-confetti-explosion";
import 'animate.css';

//define props
const props = defineProps({
    bingoId: String,
    bingoSheet: Object
})

const store = useBingoStore()

//local rows
const row1 = ref<BingoItem[]>([])
const row2 = ref<BingoItem[]>([])
const row3 = ref<BingoItem[]>([])
const row4 = ref<BingoItem[]>([])
const row5 = ref<BingoItem[]>([])
const row6 = ref<BingoItem[]>([])
const row7 = ref<BingoItem[]>([])
const row8 = ref<BingoItem[]>([])
const row9 = ref<BingoItem[]>([])
const row10 = ref<BingoItem[]>([])

const confetti = ref(false)
const explode = ref(false)
const colors = ['#6200ea', '#03a9f4', '#4caf50', '#ffeb3b', '#ff5722', '#795548', '#9c27b0', '#e91e63', '#00bcd4', '#009688', '#8bc34a', '#cddc39', '#ff9800', '#ff5722', '#607d8b']

const overlay = ref(false)

//on Mounted check if Id is in local storage
onMounted(() => {
    if (props.bingoSheet) {
        setRows()
    }
    else return
})

watch(() => props.bingoSheet, () => {
    setRows()
})

const setRows = () => {
    if(!props.bingoSheet) return
    else {
    row1.value = props.bingoSheet.items?.slice(0, 5) //slices the array into rows
    row2.value = props.bingoSheet.items?.slice(5, 10)
    row3.value = props.bingoSheet.items?.slice(10, 15)
    row4.value = props.bingoSheet.items?.slice(15, 20)
    row5.value = props.bingoSheet.items?.slice(20, 25)
    row6.value = props.bingoSheet.items?.slice(25, 30) 
    row7.value = props.bingoSheet.items?.slice(30, 35)
    row8.value = props.bingoSheet.items?.slice(35, 40)
    row9.value = props.bingoSheet.items?.slice(40, 45)
    row10.value = props.bingoSheet.items?.slice(45, 50)
    }
}

const bingoClick = (index: number, row: number, id: string) => {
    if (props.bingoSheet) {
        const item = props.bingoSheet.items?.find((item: BingoItem) => item.id === id)
        //set the item to checked/not-checked
        item!.isChecked = !item!.isChecked
        if (item!.isChecked) {
            confetti.value = true
            //update the item count
            const itemId = item!.id
            updateBingoItemCount(itemId)
            //wait 2000ms
            setTimeout(() => {
                confetti.value = false
            }, 2000)
        }
        //substract again
        else {
            minusBingoItemCount(item!.id)
        }
        //update the sheet in db
        updateSheetInDb(props.bingoSheet, props.bingoId)
        //check if bingo
        checkBingo()
    }
    else return
    }

const checkBingo = () => {
    if (props.bingoSheet) {
        const rows = [row1, row2, row3, row4, row5, row6, row7, row8, row9, row10]
        let bingo = false
        rows.forEach((row, index) => {
            if (row.value.every((item: BingoItem) => item.isChecked)) {
                bingo = true
                explode.value = true
                overlay.value = true
                localStorage.setItem('bingo', 'true')
                //save 
            }
        })
        props.bingoSheet.bingo = bingo
    }

}

//todo add bingo popup


//watch for bingo in bingoSheet
watch(() => props.bingoSheet?.bingo, () => {
    if (props.bingoSheet) {
        if (props.bingoSheet.bingo) {
            props.bingoSheet.bingo = true
            store.bingo = true
            //update user score
            updateUserScore(localStorage.getItem('userId') as string)
        }
        else {
            props.bingoSheet.bingo = false
        }
    }
})

</script>

<style scoped>

.bingoSheet {
    border: 1px solid #6200ea;
    border-radius: 10px;
    padding: 0.3rem;
    margin: 1rem 0;
    min-height: 500px;
    
}

table {
    width: 100%;   
}

td {
    font-size: 8px;
    color: #6200ea;
    background-color:white;
    border: 1px solid #6200ea;
    height: 70px;
    text-align: center;
    cursor: pointer;
    font-weight: bold;
    max-width: 75px;
}

.checked {
    background-color: #6200ea;
    color: white;
}


.bingoYes {
    background-color: #6200ea;
    color: white;
    font-size: 2rem;
    text-align: center;
    padding: 1rem;
    border-radius: 20px;
    margin-top: 1rem;
}

.bingocard {
    background-color: rgb(10, 150, 125);;
    color: white;
    font-size: 10rem;
    font-family: "Jersey 10 Charted", sans-serif;
    font-weight: 400;
    font-style: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    margin-top: 1rem;
    width: 400px;
    height: 200px;
}

.overlay {
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>