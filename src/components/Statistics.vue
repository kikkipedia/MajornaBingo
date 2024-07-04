<template>
    <div>
        <h3>Mest kryssade</h3>
        <canvas id="checkedChart"></canvas>
        <h3>Flest Bingo!</h3>
        <div id="scoreChart">         
            <p v-for="user, index in scoreChart" :key="user.id">
                <div class="topScoreNum" :id="user.id" >{{ index + 1 }}</div><span class="name">{{user.name}}:</span><span class="score">{{user.score}}</span> 
            </p>
        
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import Chart from 'chart.js/auto';
import { getBingoItems, getAllUsers } from '@/db';
import type { BingoItem } from '@/types';
import { nextTick } from 'vue';
import ChartDataLabels from 'chartjs-plugin-datalabels';

type CheckedChart = {
    id: string;
    name: string;
    checked: number;
}

type TopScorers = {
    id: string;
    name: string;
    score: number;
}

const checkedChart = ref<CheckedChart[]>([])
const scoreChart = ref<TopScorers[]>([])

const colours = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(255, 205, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(201, 203, 207, 0.6)'
]

//fetch all BingoItems from database
const getItems = async() => {
    const response = await getBingoItems()
    //sort the response by count then only keep the top 6
    checkedChart.value = response.sort((a: BingoItem, b: BingoItem) => b.count - a.count).slice(0, 6).map((item: BingoItem) => {
        return {
            id: item.id,
            name: item.item,
            checked: item.count
        }
    })
    itemChart()
}

//fetch all user scores from database
const getScores = async() => {
    const response = await getAllUsers()
    scoreChart.value = response.map((user: any) => {
        return {
            id: user.id,
            name: user.name,
            score: user.score
        }
    })
    //sort from highest to lowest, then only keep the top 4
    //delete the ones with score 0
    scoreChart.value = scoreChart.value.filter((user: any) => user.score > 0)
    scoreChart.value.sort((a, b) => b.score - a.score)
    scoreChart.value = scoreChart.value.slice(0, 4)
    nextTick(() => {
        scoreChart.value.forEach((user: any, index: number) => {
            const el = document.getElementById(user.id)
            if (el) {
                //randomise the colours
                el.style.backgroundColor = colours[index]
            }
        })
    })
}

const formatData = (data: any) => {
    let newFormat = {
        datasets: [{
            data: [] as any[],
        }],
        labels: [] as any[]
    };
    data.forEach((item: any) => {
        newFormat.datasets[0].data.push(item.checked);
        newFormat.labels.push(item.name);
    });
    return newFormat

}

//creates the bar chart

const itemChart = () => {
    const qx = document.getElementById('checkedChart') as HTMLCanvasElement
    const formatted = formatData(checkedChart.value)
    //using Chart.js for rendering graphs
    Chart.register(ChartDataLabels)
    const chart = new Chart(qx, 
    {
        type: 'bar',
        data: {
            labels: formatted.labels,
            datasets: [
                {
                    data: formatted.datasets[0].data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 205, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(201, 203, 207, 0.6)'
                    ],
                     barThickness: 15,                   
                }
            ]
        },
         options: {
            plugins: {
                legend: {
                    display: false
                },        
            },
            scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 8,
                    },
                    
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 8,
                    },
                    autoSkip: false,
                    maxRotation: 90,
                    minRotation: 90
                }
            },
        }
         }
    });
    return chart
}



onMounted(() => {
    getItems()
    getScores()
})



</script>


<style scoped>
.topScoreNum {
    font-weight: bold;
    border:  0.1em solid grey;
    border-radius: 100%;
    height: 2em;
    width: 2em;
    text-align: center;
    display: inline-block;
    margin-top: 5px;
    margin-right: 5px;
    
}   

.name {
    font-weight: bold;
    margin-right: 5px;
}

.score {
    margin-right: 5px;
}

#checkedChart {
    width: 100%;
    padding: 0;
    height: 400px;
}
</style>