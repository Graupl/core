import { h } from "vue";
import { setupClasses } from "../helpers.js";
import AdvancedComponent from "../component/advanced-component.js";
import BasicComponent from "../component/basic-component.js";

export default {
  props: {
    children: {
      type: Array,
      default: [
        h(AdvancedComponent, {
          tag: "li",
          attributes: { class: ["breadcrumb-item"] },
          children: [
            h(BasicComponent, {
              tag: "a",
              attributes: { class: ["breadcrumb-link"], href: "#" },
              text: "Home",
            }),
          ],
        }),
        h(BasicComponent, {
          tag: "li",
          attributes: { class: ["breadcrumb-item", "active"] },
          text: "Breadcrumb",
        }),
      ],
    },
    attributes: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const attributes = setupClasses(props.attributes, ["breadcrumb"]);

    return () =>
      h(
        "div",
        {
          "data-testid": "breadcrumb-frame",
          style: { width: "14rem", minHeight: "4rem", padding: "1rem" },
        },
        [
          h(AdvancedComponent, {
            ...props,
            tag: "ol",
            attributes,
          }),
        ]
      );
  },
};
