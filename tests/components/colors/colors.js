import { h } from "vue";
import "../../../dist/css/graupl.css";

export default {
  props: {
    attributes: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    return () =>
      h("div", {
        ...props.attributes,
        style: {
          ...props.attributes.style,
          width: "192px",
          height: "81px",
          colorScheme: "light",
        },
      });
  },
};
