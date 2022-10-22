<template>
  <div class="day-list">
    <div class="day-list__header">
      <button class="day-list__add-day">Prev</button>
      <h2 class="day-list__title">Today</h2>
      <button class="day-list__add-day">Next</button>
    </div>
    <div class="day-list__days"></div>
  </div>
</template>

<style lang="scss">
.day-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 50px;
    margin-bottom: 20px;
  }

  &__title {
    margin: 0;
  }

  &__add-day {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #42b983;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }

  &__days {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
</style>
