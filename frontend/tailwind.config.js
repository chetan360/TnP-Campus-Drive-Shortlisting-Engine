module.exports = {
  content: ["./main.jsx", "./components/*.jsx", "./pages/*.jsx"],
  important: true,
  theme: {
    extend: {
      boxShadow: { sm: "0 .125rem .25rem rgba(0,0,0,.075)" },
      borderColor: { DEFAULT: "#dee2e6" },
    },
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1400px",
    },
  },
};
