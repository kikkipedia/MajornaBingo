import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useBingoStore = defineStore('bingoStore', () => {
  const name = ref ('')

  function setName(newName: string) {
    name.value = newName
  }

 const bingo = ref(false)

  function setBingo(newBingo: boolean) {
    bingo.value = newBingo
  }

  const isAuth = ref()

  function setAuth(id : string | null) {
    if(id){
      isAuth.value = true   
  }
  }


  return { name, setName, bingo, setBingo, isAuth, setAuth}
})