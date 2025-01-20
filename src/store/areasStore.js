// stores/areasStore.js

import { defineStore } from 'pinia';

export const useAreasStore = defineStore('areas', {
    state: () => ({
        selectedArea: null,
        areas: [
            { name: '700-річчя', code: '700', position: { lat: 49.41963965672834, lng: 32.103188085876596 }, radius: 700, color: '#FF0000'},
            { name: 'Вантажний порт', code: 'VAN', position: { lat: 49.4355, lng: 32.0980 }, radius: 700, color: '#00FF00'},
            { name: 'Василини', code: 'VAS' },
            { name: 'Водоканал', code: 'VOD', position: { lat: 49.42808637639345, lng: 32.05982208251953 }, radius: 800, color: '#0000FF'},
            { name: 'Газороздатка', code: 'GAZ', position: { lat: 49.41595003649699, lng: 32.04537034034729 }, radius: 800, color: '#3ff4a9'},
            { name: 'Д район', code: 'D', position: { lat: 49.40443881421899, lng: 32.11702998175305 }, radius: 1000, color: '#c147cb'},
            { name: 'Дахнівка', code: 'DAH', position: { lat: 49.484910631748825, lng: 31.987037658691406 }, radius: 1000, color: '#cb9b47'},
            { name: 'Залізничний вокзал', code: 'ZAL', position: { lat: 49.42605373759808, lng: 32.05051726986188 }, radius: 700, color: '#46498b' },
            { name: 'Зелена', code: 'ZEL', position: { lat: 49.41672388638957, lng: 32.06681461059078 }, radius: 700, color: '#498b46'  },
            { name: 'Казбет', code: 'KAZ', position: { lat: 49.449546180775876, lng: 32.04763412475586 }, radius: 700, color: '#939399' },
            { name: 'к/р Мир', code: 'MIR', position: { lat: 49.42508016099293, lng: 32.077503261744546 }, radius: 700, color: '#a3edc1' },
            { name: 'Корольова', code: 'KOR', position: { lat: 49.43854424498209, lng: 32.027018380008016 }, radius: 700, color: '#b96d50' },
            { name: 'Літака', code: 'LIT', position: { lat: 49.41524507346212, lng: 32.026519775390625 }, radius: 700, color: '#d8a3ed' },
            { name: 'Луначарка', code: 'LUN', position: { lat: 49.45537693648245, lng: 32.00961112976074 }, radius: 700, color: '#0d8e0c' },
            { name: 'Можайка', code: 'MOZ', position: { lat: 49.453129248073196, lng: 32.026859529534 }, radius: 700, color: '#c7eda3' },
            { name: 'Митниця', code: 'MIT', position: { lat: 49.43805002816855, lng: 32.08823204040527 }, radius: 700, color: '#cfa3ed' },
            { name: 'Молокозавод', code: 'MOL', position: { lat: 49.41407465384668, lng: 32.08666772656333 }, radius: 700, color: '#a3edce' },
            { name: 'М\'ясокомбінат', code: 'MYA', position: { lat: 49.42886849182714, lng: 32.04440015839379 }, radius: 700, color: '#edb6a3' },
            { name: 'Оборонна', code: 'OBO', position: { lat: 49.43387005778021, lng: 32.04428647280381 }, radius: 700, color: '#eda3d2' },
            { name: 'ПЗР', code: 'PZR', position: { lat: 49.42416365262321, lng: 32.02160329543575 }, radius: 700, color: '#eda3b7' },
            { name: 'Річковий порт', code: 'RIC', position: { lat: 49.43451262626161, lng: 32.09721304984984 }, radius: 700, color: '#7f9010' },
            { name: 'Соснівка', code: 'SOS', position: { lat: 49.46892197756474, lng: 32.01053728605332 }, radius: 700, color: '#3c5bcb' },
            { name: 'Сєдова', code: 'SED', position: { lat: 49.428422906998065, lng: 32.090456662458166 }, radius: 700, color: '#8a1fc0' },
            { name: 'Хімселище', code: 'KHM', position: { lat: 49.40505338758406, lng: 32.04394340515137 }, radius: 700, color: '#614035' },
            { name: 'Центр', code: 'CEN', position: { lat: 49.441491717097755, lng: 32.064263236198826 }, radius: 1000, color: '#0ccfd2' },
            { name: 'Шкільна', code: 'SHK', position: { lat: 49.41011721110426, lng: 32.055765689692656 }, radius: 1000, color: '#50bf5f' },
            { name: 'Інше', code: 'UNK' }
        ],
    }),
    actions: {
        setSelectedArea(area) {
            this.selectedArea = area;
        },
    },
});
