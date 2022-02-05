'use strict';

// Pages

const mainPage = document.querySelector('.main-page');
const firstPage = document.querySelector('.first-page');
const secondPage = document.querySelector('.second-page');
const thirdPage = document.querySelector('.third-page');
const fourthPage = document.querySelector('.fourth-page');

// Logo

const logoContainer = document.querySelector('.logo-container-main');

// Buttons

const buttons = document.querySelectorAll('button');

const startSurveyBtn = document.querySelector('.start-btn');

const firstPageBtn = document.querySelector('.first-page-btn');

const secondPageBtn = document.querySelector('.second-page-btn');
const previousSecondBtn = document.querySelector('.previous-second-btn');

const submitSurveyBtn = document.querySelector('.submit-survey-btn');
const previousThirdBtn = document.querySelector('.previous-third-btn');

const homeBtn = document.querySelector('.home-btn');

// ButtonsTextContent

const nextStepTextContent = 'next step';
const savingTextContent = 'saving...';

const submitDataTextContent = 'submit data';
const generatingTextContent = 'generating pdf...';

const homeTextContent = 'home';
const savePdfTextContent = 'home';

// Delays

const delaySaving = 1000;
const delayGenerating = 3000;

// Tooltips

const tooltipsOfFirstPage = firstPage.querySelectorAll('.tooltip');
const tooltipsOfSecondPage = secondPage.querySelectorAll('.tooltip');
const tooltipsOfThirdPage = thirdPage.querySelectorAll('.tooltip');

// Inputs

const inputsOfFirstPage = firstPage.querySelectorAll('.input-input');
const inputsOfSecondPage = secondPage.querySelectorAll('.input-input');
const inputsOfThirdPage = thirdPage.querySelectorAll('.input-input');

// dataOfAnswers

const mapFirstStepData = new Map();
const mapSecondStepData = new Map();
const mapThirdStepData = new Map();

const steps = document.querySelectorAll('.step');
const stepDots = document.querySelectorAll('.dot');

// Application

function startSurvey() {
  validationInputText(inputsOfFirstPage, tooltipsOfFirstPage);
  validationInputText(inputsOfSecondPage, tooltipsOfSecondPage);
  validationInputText(inputsOfThirdPage, tooltipsOfThirdPage);

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.classList.contains('start-btn')) {
        mainPage.classList.add('none');

        logoContainer.classList.remove('none');
        firstPage.classList.remove('none');
      }

      if (button.classList.contains('first-page-btn')) {
        validationInputs(
          inputsOfFirstPage,
          firstPageBtn,
          firstPage,
          secondPage,
          tooltipsOfFirstPage,
          mapFirstStepData
        );
      }

      if (button.classList.contains('previous-second-btn')) {
        firstPage.classList.remove('none');

        const stepDot = document.querySelector('.dot-container');

        stepDot.classList.remove('center');

        secondPage.classList.add('none');
      }

      if (button.classList.contains('second-page-btn')) {
        validationInputs(
          inputsOfSecondPage,
          secondPageBtn,
          secondPage,
          thirdPage,
          tooltipsOfSecondPage,
          mapSecondStepData,
          previousSecondBtn
        );
      }

      if (button.classList.contains('previous-third-btn')) {
        thirdPage.classList.add('none');

        const stepDot = document.querySelector('.dot-container');

        stepDot.classList.remove('finish');

        secondPage.classList.remove('none');
      }

      if (button.classList.contains('submit-survey-btn')) {
        validationInputs(
          inputsOfThirdPage,
          submitSurveyBtn,
          thirdPage,
          fourthPage,
          tooltipsOfThirdPage,
          mapThirdStepData,
          previousThirdBtn
        );
      }

      if (button.classList.contains('home-btn')) {
        const stepDot = document.querySelector('.dot-container');
        stepDot.classList.remove('center', 'finish');

        let arrD = [
          ...mapFirstStepData,
          ...mapSecondStepData,
          ...mapThirdStepData,
        ];

        for (let i = 0; i < arrD.length; i++) {
          const space = /\s/;
          let indexOfSpace;

          for (let k = 0; k < arrD[i].length; k++) {
            if (k === 0) {
              indexOfSpace = arrD[i][k].search(space);

              arrD[i][k].slice(indexOfSpace);
              arrD[i][k] = arrD[i][k].slice(0, indexOfSpace);
            }
          }
        }

        const data = Object.fromEntries(arrD);

        console.log(data);

        clearInputsData();

        fourthPage.classList.add('none');
        logoContainer.classList.add('none');
        mainPage.classList.remove('none');
      }
    });
  });
}

function validationInputText(pageInputs, tooltips) {
  pageInputs.forEach((el, index) => {
    el.addEventListener('input', () => {
      const inputValue = el.value;

      if (inputValue !== '') {
        if (tooltips[index].classList.contains('required')) {
          tooltips[index].classList.remove('required');
        }

        tooltips[index].classList.add('opacity');
      } else {
        tooltips[index].classList.remove('opacity');
      }
    });
  });
}

function activeStep() {
  const stepDot = document.querySelector('.dot');
  const stepDotContainer = document.querySelector('.dot-container');

  const steps = document.querySelectorAll('.step');
  const styles = ['zero', 'center', 'full'];

  for (let i = 0; i < steps.length; i++) {
    if (!steps[i].classList.contains('none')) {
      stepDot.classList.add(styles[i]);
      stepDotContainer.classList.add(styles[i]);
    }
  }
}

function validationInputs(
  pageInputs,
  pageNextStepBtn,
  currentPage,
  nextPage,
  tooltips,
  dataOfAnswers,
  previousStepBtn
) {
  pageInputs.forEach((el, index) => {
    if (el.value === '') {
      tooltips[index].classList.add('opacity', 'required');

      return;
    } else if (el.value !== '') {
      dataOfAnswers.set(
        tooltips[index].textContent,
        el.value.trim().toUpperCase()
      );

      tooltips[index].classList.remove('opacity');

      if ((el.value !== '') & (dataOfAnswers.size === pageInputs.length)) {
        setTimeout(() => {
          if (previousStepBtn) {
            previousStepBtn.disabled = false;
          }

          const stepDot = document.querySelector('.dot-container');

          if (pageNextStepBtn === firstPageBtn) {
            stepDot.classList.add('center');
          } else if (pageNextStepBtn === secondPageBtn) {
            stepDot.classList.add('finish');
          }

          pageNextStepBtn.textContent = nextStepTextContent;
          pageNextStepBtn.disabled = false;

          currentPage.classList.add('none');

          nextPage.classList.remove('none');
        }, delaySaving);

        if (previousStepBtn) {
          previousStepBtn.disabled = true;
        }

        if (pageNextStepBtn === submitSurveyBtn) {
          pageNextStepBtn.textContent = generatingTextContent;
        } else {
          pageNextStepBtn.textContent = submitDataTextContent;
        }

        pageNextStepBtn.disabled = true;
      }
    }
  });
}

function startPositionOfStepDots() {
  const stepDot = document.querySelector('.dot');
  const stepDotContainer = document.querySelector('.dot-container');

  stepDot.classList.remove('full');
  stepDotContainer.classList.remove('full');

  stepDot.classList.remove('center');
  stepDotContainer.classList.remove('center');
}

function clearInputsData() {
  document.querySelectorAll('.input-input').forEach((input) => {
    input.value = '';
  });
}

const dataCopy = {
  '1. Wat is uw voornaam? *': 'GHFGH',
  '2. Wat is uw achternaam? *': 'HFGHFGH',
  '3. In welke plaats bent u woonachtig? *': 'FGHFGH',
  '4. Op welk telefoonnummer kunnen wij u bereiken? *': '+',
  '5. Wat is uw e-mailadres? *': 'FGHFGH',
  '6. Wat is uw geboortejaar? *': '20.02.4',
  '7. Beschikt u over een rijbewijs? *': 'ON',
  '8. Welke opleiding(en) heeft u gevolgd? *': 'R',
  '9. Beschrijf u zelf kort in een aantal woorden. *': 'R',
  '10. Naar welke functie(s) bent u op zoek? *': 'R',
  '11. Wat is de naam van uw laatste werkgever? *': 'R',
  '12.1 van': '1',
  '12.2 naar': '1',
  '13. In welke functie? *': 'D',
  '14. Wat is de naam van de werkgever ervoor? *': 'FGHGHF',
  '15.1 van': '1',
  '15.2 naar': '1',
  '16. In welke functie? *': 'FGHFGHFGHF',
};

let arrD = [
  ['1. Wat is uw voornaam? *', 'GHFGH'],
  ['2. Wat is uw achternaam? *', 'HFGHFGH'],
  ['3. In welke plaats bent u woonachtig? *', 'FGHFGH'],
  ['4. Op welk telefoonnummer kunnen wij u bereiken? *', '+'],
  ['5. Wat is uw e-mailadres? *', 'FGHFGH'],
  ['6. Wat is uw geboortejaar? *', '20.02.4'],
  ['7. Beschikt u over een rijbewijs? *', 'ON'],
  ['8. Welke opleiding(en) heeft u gevolgd? *', 'R'],
  ['9. Beschrijf u zelf kort in een aantal woorden. *', 'R'],
  ['10. Naar welke functie(s) bent u op zoek? *', 'R'],
  ['11. Wat is de naam van uw laatste werkgever? *', 'R'],
  ['12.1. van', '1'],
  ['12.2. naar', '1'],
  ['13. In welke functie? *', 'D'],
  ['14. Wat is de naam van de werkgever ervoor? *', 'FGHGHF'],
  ['15.1. van', '1'],
  ['15.2. naar', '1'],
  ['16. In welke functie? *', 'FGHFGHFGHF'],
];

// console.log(arrD);

// IMask

document.addEventListener('DOMContentLoaded', () => {
  const mask = (dataValue, options) => {
    // создаем универсальную функцию
    const elements = document.querySelectorAll(`[data-mask="${dataValue}"]`); // ищем поля ввода по селектору с переданным значением data-атрибута
    if (!elements) return; // если таких полей ввода нет, прерываем функцию

    elements.forEach((el) => {
      // для каждого из полей ввода
      IMask(el, options); // инициализируем плагин imask для необходимых полей ввода с переданными параметрами маски
    });
  };

  // Используем наше функцию mask для разных типов масок

  // Маска для номера телефона
  mask('phone', {
    mask: '+{00} (000)-0000-00',
  });

  // Маска для почтового индекса
  mask('postalCode', {
    mask: '000000', // шесть цифр
  });

  // Маска для полной даты
  mask('date', {
    mask: Date,
    min: new Date(1900, 0, 1), // минимальная дата 01.01.1900
  });

  // Маска для даты - месяц, год
  // mask('date-month-year', {
  //   mask: Date,
  //   min: new Date(1900, 0, 1), // минимальная дата 01.01.1900
  // });

  // Маска для числа
  mask('number', {
    mask: Number,
    thousandsSeparator: ' ', // разделитель тысяч в числе
  });
});

window.addEventListener('load', () => {
  startSurvey();
});
