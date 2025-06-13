module.exports = {
  root: true,
  extends: [
    'next',
    'next/core-web-vitals',
    'prettier'
  ],
  rules: {
    // Отключаем некоторые правила для упрощения разработки
    "react-hooks/exhaustive-deps": "off", // Отключаем предупреждения о зависимостях
    "@next/next/no-img-element": "off",
    "react/no-unescaped-entities": "off",
    "react-hooks/rules-of-hooks": "error" // Оставляем только критичные правила для хуков
  }
};
