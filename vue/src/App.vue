<template>
    <div class="windowSW">
      <div class="windowSW__wrapper">
        <div class="windowSW__box">
          <input type="text">
        </div>
      </div>
    </div>

  <header>
    <h1>Ресурс предназначен для анализа информационной насыщенности</h1>
  </header>
  <div class="wrapper methods">
    <button @click="method=0">Текстовое поле</button>
    <span>|</span>
    <button @click="method=1">Файл</button>
  </div>
  <form @submit.prevent>
    <div class="wrapper">
      <div class="textinput" v-if="method == 0">
        <h2>Внесите текст в текстовое поле:</h2>
        <textarea v-model="text" id="" cols="30" rows="10"></textarea>
        <button @click="checkClick">check</button>
      </div>

      <div class="fileinput" v-else>
        <h2>Загрузите файл с расширением .txt .pdf</h2>
        <input type="file" name="" id="">
        <button @click="checkClick">check</button>
      </div>

      <div class="criteria">
        <div class="criteria__wrapper">
          <h3>Критерий абстрактности</h3>

          <div class="criteria__info">
            <p>Кол-во слов: {{ this.criteria.count }}</p>
            <p>Кол-во абстрактных слов: {{ this.criteria.abcount }}</p>
            <p>Критерий абстрактности: {{ this.criteria.abcriteria }}</p>
            <p>Абстрактные слова: </p>

            <span v-for="item in criteria.abwords" :key="item">{{ item.word }} ({{ item.count }})</span>
          </div>
        </div>
        <div class="criteria__wrapper">
          <div class="criteria__header">
            <h3>Стоп-слова</h3>
            <button @click="listSWClick">Список стоп слов</button>
          </div>

          <div class="criteria__info">
            <p>Количество: {{ this.criteria.swcount }}</p>
            <p>Критерий водности: {{ this.criteria.swcriteria }}</p>
            <p>Стоп слова:</p>

            <span v-for="item in criteria.swwords" :key="item">{{ item.word }} ({{ item.count }})</span>
          </div>
        </div>
        <div class="criteria__wrapper">
          <h3>Ключевые слова</h3>

          <div class="criteria__info">
            <input v-model="keywords" type="number" placeholder="Количество ключевых слов" @change="if(keywords <= 0) keywords = 1;">
            <div class="criteria__keywords">
              <div v-for="item in criteria.keywords" :key="item.word">Ключевое слово: "<span>{{ item.word }}</span>", кол-во повторений: <span>{{ item.count }}</span>, плотность: <span>{{ item.criteria }}</span></div>
            </div>
          </div>
        </div>

        <div class="criteria__wrapper">
          <h3>Академические слова</h3>

          <div class="criteria__info">
            <p>Академических слов: {{ criteria.academiccount }}</p>
            <p>Доля академических слов: {{ criteria.academiccriteria }}</p>

            <span v-for="item in criteria.academicwords" :key="item.count">{{ item.word }} ({{ item.count }})</span>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
  import './style/style.scss';
  import axios from 'axios'

  export default {
    name: 'App',
    data(){
      return{
        criteria: Object,
        text: '',
        informative: 0.0,
        method: 0,
        keywords: 2,
      }
    },
    methods: {
      checkClick(){
        if(this.method == 0 && this.text.length == 0){
          alert("Пустоте значение");
          return;
        }
        //this.informativeness();
        axios.post("http://localhost:3000/get", {text: this.text, keywords: this.keywords}).then((res) => {
          this.criteria = res.data;
        });
      },

      listSWClick(){
        
      }
    },
  }
</script>
