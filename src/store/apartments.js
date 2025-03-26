// stores/apartments.js
import { defineStore } from 'pinia';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

export const useApartmentsStore = defineStore('apartments', {
    state: () => ({
        dropdowns: {
            areas: [
                { name: '700-річчя', code: '700', position: { lat: 49.41963965672834, lng: 32.103188085876596 }, radius: 700, color: '#FF0000'},
                { name: 'Вантажний порт', code: 'VAN', position: { lat: 49.4355, lng: 32.0980 }, radius: 700, color: '#00FF00'},
                { name: 'Водоканал', code: 'VOD', position: { lat: 49.42808637639345, lng: 32.05982208251953 }, radius: 400, color: '#0000FF'},
                { name: 'Газороздатка', code: 'GAZ', position: { lat: 49.41595003649699, lng: 32.04537034034729 }, radius: 500, color: '#3ff4a9'},
                { name: 'Д район', code: 'D', position: { lat: 49.40443881421899, lng: 32.11702998175305 }, radius: 1000, color: '#c147cb'},
                { name: 'Дахнівка', code: 'DAH', position: { lat: 49.484910631748825, lng: 31.987037658691406 }, radius: 1200, color: '#cb9b47'},
                { name: 'Залізничний вокзал', code: 'ZAL', position: { lat: 49.42605373759808, lng: 32.05051726986188 }, radius: 400, color: '#46498b' },
                { name: 'Зелена', code: 'ZEL', position: { lat: 49.41672388638957, lng: 32.06681461059078 }, radius: 500, color: '#498b46'  },
                { name: 'Казбет', code: 'KAZ', position: { lat: 49.449546180775876, lng: 32.04763412475586 }, radius: 1000, color: '#939399' },
                { name: 'к/р Мир', code: 'MIR', position: { lat: 49.42508016099293, lng: 32.077503261744546 }, radius: 700, color: '#a3edc1' },
                { name: 'Корольова', code: 'KOR', position: { lat: 49.43854424498209, lng: 32.027018380008016 }, radius: 700, color: '#b96d50' },
                { name: 'Літака', code: 'LIT', position: { lat: 49.41524507346212, lng: 32.026519775390625 }, radius: 700, color: '#d8a3ed' },
                { name: 'Луначарка', code: 'LUN', position: { lat: 49.45537693648245, lng: 32.00961112976074 }, radius: 700, color: '#0d8e0c' },
                { name: 'Можайка', code: 'MOZ', position: { lat: 49.453129248073196, lng: 32.026859529534 }, radius: 700, color: '#c7eda3' },
                { name: 'Митниця', code: 'MIT', position: { lat: 49.43805002816855, lng: 32.08823204040527 }, radius: 700, color: '#cfa3ed' },
                { name: 'Молокозавод', code: 'MOL', position: { lat: 49.41672388638957, lng: 32.08666772656333 }, radius: 500, color: '#a3edce' },
                { name: 'Яблуневий', code: 'APPLE', position: { lat: 49.41011721110426, lng: 32.08666772656333 }, radius: 500, color: '#a3edce' },
                { name: 'М\'ясокомбінат', code: 'MYA', position: { lat: 49.42886849182714, lng: 32.04440015839379 }, radius: 300, color: '#edb6a3' },
                { name: 'Оборонна', code: 'OBO', position: { lat: 49.43387005778021, lng: 32.04428647280381 }, radius: 700, color: '#eda3d2' },
                { name: 'Сади', code: 'GARDEN', position: { lat: 49.40443881421899, lng: 32.077503261744546 }, radius: 900, color: '#939399' },
                { name: 'ПЗР', code: 'PZR', position: { lat: 49.42416365262321, lng: 32.02160329543575 }, radius: 1200, color: '#eda3b7' },
                { name: 'Річковий порт', code: 'RIC', position: { lat: 49.43451262626161, lng: 32.09721304984984 }, radius: 700, color: '#7f9010' },
                { name: 'Соснівка', code: 'SOS', position: { lat: 49.46892197756474, lng: 32.01053728605332 }, radius: 700, color: '#3c5bcb' },
                { name: 'Сєдова', code: 'SED', position: { lat: 49.428422906998065, lng: 32.090456662458166 }, radius: 700, color: '#8a1fc0' },
                { name: 'Хімселище', code: 'KHM', position: { lat: 49.40505338758406, lng: 32.04394340515137 }, radius: 700, color: '#614035' },
                { name: 'Центр', code: 'CEN', position: { lat: 49.441491717097755, lng: 32.064263236198826 }, radius: 1000, color: '#0ccfd2' },
                { name: 'Шкільна', code: 'SHK', position: { lat: 49.41011721110426, lng: 32.055765689692656 }, radius: 700, color: '#50bf5f' },
                { name: 'Руставі', code: 'RUST', position: { lat: 49.43854424498209, lng: 32.00961112976074 }, radius: 900, color: '#c7eda3' },
                { name: 'Школа майстрів', code: 'SHKM', position: { lat: 49.4285, lng: 32.0675 }, radius: 300, color: '#50cf7d' },
                { name: 'Пилипенка', code: 'KPP', position: { lat: 49.42395487625772, lng: 32.05377564145998 }, radius: 300, color: '#7cb3a1' },
            ],
            cities: [
                { name: 'Черкаси', code: '1' },
                { name: 'Байбузи', code: '2' },
                { name: 'Березняки', code: '3' },
                { name: 'Білозір\'я', code: '4' },
                { name: 'Будище', code: '5' },
                { name: 'Вергуни', code: '6' },
                { name: 'Геронимівка', code: '7' },
                { name: 'Гута Межирицька', code: '8' },
                { name: 'Дубіївка', code: '9' },
                { name: 'Думанці', code: '10' },
                { name: 'Ірдинь', code: '11' },
                { name: 'Кумейки', code: '12' },
                { name: 'Леськи', code: '13' },
                { name: 'Лозівок', code: '14' },
                { name: 'Мошни', code: '15' },
                { name: 'Мошногір\'я', code: '16' },
                { name: 'Первомайськ', code: '17' },
                { name: 'Руська Поляна', code: '18' },
                { name: 'Сагунів', code: '19' },
                { name: 'Свидівок', code: '20' },
                { name: 'Софіївка', code: '21' },
                { name: 'Сокирне', code: '22' },
                { name: 'Степанки', code: '23' },
                { name: 'Тубільці', code: '24' },
                { name: 'Хацьки', code: '25' },
                { name: 'Хрещатик', code: '26' },
                { name: 'Худяки', code: '27' },
                { name: 'Хутори', code: '28' },
                { name: 'Червона Слобода', code: '29' },
                { name: 'Чорнявка', code: '30' },
                { name: 'Шелепухи', code: '31' },
                { name: 'Яснозір\'я', code: '32' },
                { name: 'Нечаївка', code: '33' },
            ],
            category: [
                { name: 'Квартира', code: 'apartments' },
                { name: 'Кімната', code: 'rooms' },
                { name: 'Будинок', code: 'houses' },
                { name: 'Гараж', code: 'garages' },
                { name: 'Приміщення', code: 'offices' },
                { name: 'Будівлі', code: 'commercial' },
                { name: 'Земельна ділянка', code: 'land' },
                { name: 'Інше', code: 'other' }
            ],
            subcategory: [
                { name: 'Продаж', code: 'sell' },
                { name: 'Довгострокова оренда', code: 'rent' },
                { name: 'Короткострокова оренда', code: 'daily' },
                { name: 'Обмін', code: 'exchange' },
            ],
            purposeOfUses: [
                { name: 'Продаж', code: 'sell' },
                { name: 'Оренда', code: 'rent' },
                { name: 'Короткострокова оренда', code: 'daily' },
                { name: 'Обмін', code: 'exchange' }
            ],
            furnitureOptions: [
                { name: 'З меблями', code: 'FURN' },
                { name: 'Без меблів', code: 'NO_FURN' }
            ],
            parking: [
                { name: 'Немає', code: 'NULL' },
                { name: 'Паркінг', code: 'PARK' },
                { name: 'Гараж', code: 'GARAGE' },
                { name: 'Паркінг на території', code: 'PARK_AREA' },
                { name: 'Гараж на території', code: 'GARAGE_AREA' },
                { name: 'Підземний паркінг', code: 'UNDERGROUND_PARK' },
                { name: 'Відкрите паркування', code: 'OPEN_PARK' },
                { name: 'Паркування у дворі', code: 'COURTYARD_PARK' },
                { name: 'Місце для паркування', code: 'PARKING_SPACE' }
            ],
            regions: [
                { name: 'Черкаська', code: 'CHK' },
                { name: 'Вінницька', code: 'VIN' },
                { name: 'Волинська', code: 'VOL' },
                { name: 'Дніпропетровська', code: 'DNE' },
                { name: 'Донецька', code: 'DON' },
                { name: 'Крим', code: 'CRR' },
                { name: 'Житомирська', code: 'ZHM' },
                { name: 'Закарпатська', code: 'ZAK' },
                { name: 'Запорізька', code: 'ZAP' },
                { name: 'Київська', code: 'KIE' },
                { name: 'Кіровоградська', code: 'KIR' },
                { name: 'Луганська', code: 'LUG' },
                { name: 'Львівська', code: 'LVV' },
                { name: 'Миколаївська', code: 'MYK' },
                { name: 'Одеська', code: 'ODR' },
                { name: 'Полтавська', code: 'PLT' },
                { name: 'Рівненська', code: 'RIV' },
                { name: 'Сумська', code: 'SUM' },
                { name: 'Тернопільська', code: 'TER' },
                { name: 'Харківська', code: 'KH' },
                { name: 'Херсонська', code: 'KHE' },
                { name: 'Хмельницька', code: 'KM' },
                { name: 'Чернівецька', code: 'CHV' },
                { name: 'Чернігівська', code: 'CHG' },
                { name: 'Івано-Франківська', code: 'IVF' }
            ],
            buildingTypes: [
                {
                    name: 'Цегляний',
                    value: 'brick'
                },
                {
                    name: 'Панельний',
                    value: 'panel'
                },
                {
                    name: 'Монолітний',
                    value: 'monolith'
                },
                {
                    name: 'Блочний',
                    value: 'foamBlock'
                },
                {
                    name: 'Дерев\'яний',
                    value: 'wooden'
                },
                {
                    name: 'Дерево-цегла',
                    value: 'skirt'
                },
                {
                    name: 'Саман',
                    value: 'saman'
                },
                {
                    name: 'Шлакоблок',
                    value: 'shlakoBlock'
                },
                {
                    name: 'Газоблок',
                    value: 'gasBlock'
                },
                {
                    name: 'Ракушняк',
                    value: 'shellRock'
                },
                {
                    name: 'Інше',
                    value: 'other'
                }
            ],
            reconditioning: [
                {
                    name: 'Після будівельників',
                    value: 'afterBuilders'
                },
                {
                    name: 'Потребує ремонту',
                    value: 'needsRepair'
                },
                {
                    name: 'Євроремонт',
                    value: 'euro'
                },
                {
                    name: 'Жилий стан',
                    value: 'living'
                },
                {
                    name: 'Косметичний ремонт',
                    value: 'cosmetic'
                },
                {
                    name: 'Інше',
                    value: 'other'
                }
            ],
            furniture: [
                { name: 'З меблями', code: 'FURN' },
                { name: 'Без меблів', code: 'NO_FURN' },
                { name: 'Частково мебльоване', code: 'PART_FURN' },
                { name: 'Меблі на замовлення', code: 'CUST_FURN' },
                { name: 'Інше', code: 'OTHER' }
            ],
            balconyTerrace: [
                { name: 'Немає', code: 'NULL' },
                { name: 'Балкон', code: 'BALCONY' },
                { name: 'Лоджія', code: 'LOGGIA' },
                { name: 'Тераса', code: 'TERRACE' },
                { name: 'Вікно', code: 'WINDOW' },
                { name: 'Веранда', code: 'VERANDA' }
            ],
            objectClass: [
                {
                    name: 'Елітний',
                    value: 'elite'
                },
                {
                    name: 'Бізнес',
                    value: 'business'
                },
                {
                    name: 'Комфорт',
                    value: 'comfort'
                },
                {
                    name: 'Економ',
                    value: 'economy'
                },
                {
                    name: 'Стандарт',
                    value: 'standard'
                },
                {
                    name: 'Преміум',
                    value: 'premium'
                },
                {
                    name: 'Соціальний',
                    value: 'social'
                },
                {
                    name: 'Інше',
                    value: 'other'
                }
            ],
            utilities: [
                { name: 'Електрика', code: 'ELEC' , key: 'electricity'},
                { name: 'Вода', code: 'WTR', key: 'water' },
                { name: 'Каналізація', code: 'SWR', key: 'sewerage' },
                { name: 'Газ', code: 'GAS', key: 'gas' },
                { name: 'Опалення', code: 'HTG', key: 'heating' },
                { name: 'Інтернет', code: 'INT', key: 'internet' },
                { name: 'Телебачення', code: 'TV', key: 'TV' },
                { name: 'Телефон', code: 'TEL', key: 'phone' },
                { name: 'Сигналізація', code: 'ALR', key: 'alarm' },
                { name: 'Кондиціонування', code: 'AC', key: 'conditioning' },
                { name: 'Вентиляція', code: 'VENT', key: 'ventilation' },
                { name: 'Відеоспостереження', code: 'VDO', key: 'video' },
                { name: 'Домофон', code: 'PHN', key: 'intercom' },
                { name: 'Система "розумний будинок"', code: 'SMART', key: 'smartHouse' },
            ],
            heatingTypes: [
                {
                    name: 'Централізоване',
                    value: 'central'
                },
                {
                    name: 'Автономне',
                    value: 'autonomous'
                },
                {
                    name: 'Індивідуальне',
                    value: 'individual'
                },
                {
                    name: 'Газове опалення',
                    value: 'gas'
                },
                {
                    name: 'Електричне опалення',
                    value: 'electric'
                },
                {
                    name: 'Твердопаливне опалення',
                    value: 'solidFuel'
                }
            ],
            conditions: [
                {
                    name: 'Новобудова',
                    value: 'newBuilding'
                },
                {
                    name: 'Вторинний',
                    value: 'secondaryMarket'
                },
                {
                    name: 'В процесі будівництва',
                    value: 'buildingProcess'
                }
            ],
            planning: [
                { name: 'Кімнати ізольовані', code: 'ROOMS' },
                { name: 'Кімнати суміжні', code: 'ADJACENT' },
                { name: 'Студія', code: 'STUDIO' },
                { name: 'Інше', code: 'OTHER' }
            ],
            bathroom: [
                { name: 'Роздільний', code: 'SEPARATE' },
                { name: 'Разом', code: 'TOGETHER' },
                { name: 'Інше', code: 'OTHER' }
            ],
            typeOwner: [
                { name: 'Власник', code: 'PRIVATE' },
                { name: 'Агенція', code: 'AGENT' },
                { name: 'Забудовник', code: 'DEVELOPER' },
                { name: 'Інше', code: 'OTHER' }
            ],
            appointment: [
                { name: 'ОСГ', code: 'osg' },
                { name: 'Приватна', code: 'private' },
                { name: 'Індивідуальне садівництво', code: 'gardening' },
                { name: 'Будівництво', code: 'construction' },
                { name: 'Інше', code: 'other' }
            ]
        },
        saving: false,
        displayCurrency: [{ name: '$', value: 'USD' }]
    }),
    getters: {
        getDisplayCurrency: (state) => state.displayCurrency,
        getDropdowns: (state) => state.dropdowns,
        getSaving: (state) => state.saving,
        async getLastPropertyId() {
            const db = getFirestore();
            const configDocRef = doc(db, 'config', 'NSrSG9Ujs2YYYjPgWsF1'); // Укажите путь к документу
            const configDoc = await getDoc(configDocRef);

            if (configDoc.exists()) {
                const data = configDoc.data();
                return data.lastPropertyId; // Возвращает значение поля
            } else {
                console.error('Документ не найден!');
                return null;
            }
        },
    },
    actions: {
        setCurrencies(arr) {
            this.displayCurrency = arr;
        },
        async updateLastPropertyId(newId) {
            const db = getFirestore();
            const configDocRef = doc(db, 'config', 'NSrSG9Ujs2YYYjPgWsF1'); // Укажите путь к документу

            try {
                await updateDoc(configDocRef, {
                    lastPropertyId: Number(newId)
                });
            } catch (error) {
                console.error('Ошибка обновления lastPropertyId:', error);
            }
        }
    }
});
