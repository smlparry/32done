<template>
  <day-list />
</template>

<script>
import DayList from "@/components/DayList";

export default {
  name: "App",

  components: {
    DayList,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
