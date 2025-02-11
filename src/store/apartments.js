// stores/apartments.js
import { defineStore } from 'pinia';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

export const useApartmentsStore = defineStore('apartments', {
    state: () => ({
        dropdowns: {
            areas: [
                { name: '700-річчя', code: '700' },
                { name: 'Вантажний порт', code: 'VAN' },
                { name: 'Василини', code: 'VAS' },
                { name: 'Водоканал', code: 'VOD' },
                { name: 'Газороздатка', code: 'GAZ' },
                { name: 'Д район', code: 'D' },
                { name: 'Дахнівка', code: 'DAH' },
                { name: 'Залізничний вокзал', code: 'ZAL' },
                { name: 'Зелена', code: 'ZEL' },
                { name: 'Казбет', code: 'KAZ' },
                { name: 'к/р Мир', code: 'MIR' },
                { name: 'Корольова', code: 'KOR' },
                { name: 'Літака', code: 'LIT' },
                { name: 'Луначарка', code: 'LUN' },
                { name: 'Можайка', code: 'MOZ' },
                { name: 'Митниця', code: 'MIT' },
                { name: 'Молокозавод', code: 'MOL' },
                { name: 'М\'ясокомбінат', code: 'MYA' },
                { name: 'Оборонна', code: 'OBO' },
                { name: 'ПЗР', code: 'PZR' },
                { name: 'Річковий порт', code: 'RIC' },
                { name: 'Соснівка', code: 'SOS' },
                { name: 'Сєдова', code: 'SED' },
                { name: 'Хімселище', code: 'KHM' },
                { name: 'Центр', code: 'CEN' },
                { name: 'Шкільна', code: 'SHK' },
                { name: 'Інше', code: 'UNK' }
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
                { name: 'Будинок', code: 'houses' },
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
                    name: 'Скиртовий',
                    value: 'skirt'
                },
                {
                    name: 'Інше',
                    value: 'other'
                }
            ],
            reconditioning: [
                {
                    name: 'Євроремонт',
                    value: 'euro'
                },
                {
                    name: 'Житловий стан',
                    value: 'living'
                },
                {
                    name: 'Потребує ремонту',
                    value: 'needsRepair'
                },
                {
                    name: 'Від забудовника',
                    value: 'developer'
                },
                {
                    name: 'Після будівельників',
                    value: 'afterBuilders'
                },
                {
                    name: 'Після ремонту',
                    value: 'afterRepair'
                },
                {
                    name: 'Без обробки',
                    value: 'withoutFinishing'
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
            householdAppliances: {
                kitchen: [
                    { name: 'Плита', code: 'STV' },
                    { name: 'Духовка', code: 'OVN' },
                    { name: 'Витяжка', code: 'HOD' },
                    { name: 'Холодильник', code: 'FRZ' },
                    { name: 'Посудомийна машина', code: 'DW' },
                    { name: 'Мікрохвильова піч', code: 'MW' },
                    { name: 'Кавоварка', code: 'COF' },
                    { name: 'Чайник', code: 'KTL' },
                    { name: 'Інше', code: 'OTH' }
                ],
                bathroom: [
                    { name: 'Ванна', code: 'BTH' },
                    { name: 'Душова кабіна', code: 'SHW' },
                    { name: 'Унітаз', code: 'WC' },
                    { name: 'Біде', code: 'BID' },
                    { name: 'Умивальник', code: 'SNK' },
                    { name: 'Підігрів підлоги', code: 'UFH' },
                    { name: 'Інше', code: 'OTH' }
                ],
                livingRoom: [
                    { name: 'Телевізор', code: 'TV' },
                    { name: 'Камін', code: 'FRP' },
                    { name: 'Музичний центр', code: 'HIF' },
                    { name: 'Інше', code: 'OTH' }
                ],
                bedroom: [
                    { name: 'Ліжко', code: 'BD' },
                    { name: 'Шафа', code: 'WRD' },
                    { name: 'Комод', code: 'DRS' },
                    { name: 'Тумбочка', code: 'NTS' },
                    { name: 'Інше', code: 'OTH' }
                ],
            },
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
            ]
        },
        saving: false,
    }),
    getters: {
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
