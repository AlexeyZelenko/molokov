// stores/apartments.js
import { defineStore } from 'pinia';

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
                { name: 'Комерційна нерухомість', code: 'commercial' },
                { name: 'Земельна ділянка', code: 'land' },
                { name: 'Гараж', code: 'garage' },
                { name: 'Інше', code: 'other' }
            ],
            purposeOfUses: [
                { name: 'Продаж', code: 'SALE' },
                { name: 'Оренда', code: 'LTD' },
                { name: 'Короткострокова оренда', code: 'STL' }
            ],
            furnitureOptions: [
                { name: 'З меблями', code: 'FURN' },
                { name: 'Без меблів', code: 'NO_FURN' }
            ],
            parking: [
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
                }
            ],
            furniture: [
                { name: 'З меблями', code: 'FURN' },
                { name: 'Без меблів', code: 'NO_FURN' },
                { name: 'Частково мебльоване', code: 'PART_FURN' },
                { name: 'Меблі на замовлення', code: 'CUST_FURN' }
            ],
            balconyTerrace: [
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
                }
            ],
            utilities: [
                { name: 'Електрика', code: 'ELEC' , key: 'electricity'},
                { name: 'Вода', code: 'WTR', key: 'water' },
                { name: 'Каналізація', code: 'SWR', key: 'sewerage' },
                { name: 'Газ', code: 'GAS', key: 'gas' },
                { name: 'Опалення', code: 'HTG', key: 'heating' },
                { name: 'Інтернет', code: 'INT', key: 'internet' },
                { name: 'Телебачення', code: 'TV', key: 'TV' }
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
                    name: 'Вторинний ринок',
                    value: 'secondaryMarket'
                }
            ],
            subcategory: [
                { name: 'Продаж', code: 'sell' },
                { name: 'Довгострокова оренда', code: 'rent' },
                { name: 'Короткострокова оренда', code: 'daily' },
                { name: 'Обмін', code: 'exchange' },
            ]
        },
        saving: false,
    })
});
