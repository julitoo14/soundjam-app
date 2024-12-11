import{ computed } from 'vue';

function useBackgroundColor(props){
    return computed(() => {
        const options = {
            danger: "red",
            info: "blue",
            warning: "yellow"
        }

        return options[props.type];
      });
}

export { useBackgroundColor};