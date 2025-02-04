"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wordsRU = `яблоко    мост    фонарь    корабль    компьютер    птица    звезда    книга    самолёт    снег    трава    замок    солнце    луна    вода    медведь    пламя    ключ    камень    дракон    молния    тигр    машина    дерево    свет    ветер    поезд    башня    радуга    кот    ручка    зеркало    рыцарь    перо    шлем    песок    змея    оружие    карта    ворота    глаз    тень    робот    король    кость    сыр    оса    небо    гриб    рубин    щит    замок`;
const wordsEN = "apple    bridge    lantern    ship    computer    bird    star    book    airplane    snow    grass    castle    sun    moon    water    bear    flame    key    stone    dragon    lightning    tiger    car    tree    light    wind    train    tower    rainbow    cat    pen    mirror    knight    feather    helmet    sand    snake    weapon    map    gate    eye    shadow    robot    king    bone    cheese    wasp    sky    mushroom    ruby    shield    castle";
const wordsUK = "яблуко    міст    ліхтар    корабель    комп'ютер    птах    зірка    книга    літак    сніг    трава    замок    сонце    місяць    вода    ведмідь    полум'я    ключ    камінь    дракон    блискавка    тигр    машина    дерево    світло    вітер    поїзд    вежа    веселка    кіт    ручка    дзеркало    лицар    перо    шолом    пісок    змія    зброя    карта    ворота    око    тінь    робот    король    кістка    сир    оса    небо    гриб    рубін    щит    замок";
exports.default = {
    ru: wordsRU.toUpperCase().split("    "),
    en: wordsEN.toUpperCase().split("    "),
    uk: wordsUK.toUpperCase().split("    ")
};
