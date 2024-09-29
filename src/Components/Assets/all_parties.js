import bali from './bali.webp';
import kika from './kika.jpg';
import terrazas from './terrazas.jpg';
import pacha from './pacha.jpg';
import ibiza from './ibiza.jpeg';
import samba from './samba.jpg';
import disco from './disco.jpg';
import reggae from './reggae.jpg';
import electro from './electro.jpg';
import jazz from './jazz.jpg';
import revival from './revival.jpg';
import hiphop from './hiphop.jpg';
import rock from './rock.jpg';
import latin from './latin.jpg';
import karaoke from './karaoke.jpg';
import carnival from './carnival.jpg';
import funky_town from './funky_town.jpg';
import masquerade from './masquerade.jpg';
import salsa from './salsa.jpg';
import techno from './techno.jpg';
import duki from './duki.jpg';
import badBunny from './badbunny.jpg';
import tini from './tini.webp';
import karolG from './karolg1.jpg';
import daddyYankee from './daddyyankee.avif';
import lali from './lali.avif';


let all_parties = [
    {
        id: 1,
        name: "Bali",
        image: bali,
        new_price: 100,
        fecha:'2024-05-14',
        hora:'19:50',
        lugar: 'Estadio River Plate',
        ubicacion:'Av Figueroa Alcorta y Udaondo',
        stock: 1
    },
    {
        id: 2,
        name: "Kika",
        image: kika,
        new_price: 150,
        old_price: 250,
        category: "recintos",
        fecha:'2024-10-16',
        hora:'18:30',
        lugar: 'Teatro Vorterix',
        ubicacion:'Av. Federico Lacroze 3455',
        stock: 100
    },
    {
        id: 3,
        name: "Terrazas joda",
        image: terrazas,
        new_price: 120,
        old_price: 220,
        category: "recintos",
        fecha:'2024-01-02',
        hora:'18:30',
        lugar: 'Teatro Gran Rex',
        ubicacion:'Av. Corrientes 857',
        stock: 100
    },
    {
        id: 4,
        name: "Pacha",
        image: pacha,
        new_price: 90,
        old_price: 180,
        category: "recintos",
        fecha:'2024-04-04',
        hora:'18:30',
        lugar: 'Niceto Club',
        ubicacion:'Av. Cnel. Niceto Vega 5510',
        stock: 100
    },
    {
        id: 5,
        name: "Ibiza Beach Party",
        image: ibiza,
        new_price: 180,
        old_price: 280,
        category: "recintos",
        fecha:'2024-06-23',
        hora:'18:30',
        lugar: 'Estadio River Plate',
        ubicacion:'Av Figueroa Alcorta y Udaondo',
        stock: 100
    },
    {
        id: 6,
        name: "Samba Nights",
        image: samba,
        new_price: 200,
        old_price: 300,
        category: "recintos",
        fecha:'2024-11-24',
        hora:'18:30',
        lugar: 'La Trastienda Club',
        ubicacion:'Balcarce 460',
        stock: 100
    },
    {
        id: 7,
        name: "Disco Fever",
        image: disco,
        new_price: 140,
        old_price: 240,
        category: "recintos",
        fecha:'2024-09-30',
        hora:'18:30',
        lugar: 'Teatro Gran Rex',
        ubicacion:'Av. Corrientes 857',
        stock: 100
    },
    {
        id: 8,
        name: "Reggae Rhythms",
        image: reggae,
        new_price: 120,
        old_price: 220,
        category: "recintos",
        fecha:'2024-02-29',
        hora:'18:30',
        lugar: 'Teatro Vorterix',
        ubicacion:'Av. Federico Lacroze 3455',
        stock: 100
    },
    {
        id: 9,
        name: "Electro Lounge",
        image: electro,
        new_price: 160,
        old_price: 260,
        category: "recintos",
        fecha:'2024-02-14',
        hora:'18:30',
        lugar: 'Estadio River Plate',
        ubicacion:'Av Figueroa Alcorta y Udaondo',
        stock: 100
    },
    {
        id: 10,
        name: "Jazz Club",
        image: jazz,
        new_price: 130,
        old_price: 230,
        category: "recintos",
        fecha:'2024-12-08',
        hora:'18:30',
        lugar: 'Teatro Gran Rex',
        ubicacion:'Av. Corrientes 857',
        stock: 100
    },
    {
        id: 11,
        name: "Rooftop Revival",
        image: revival,
        new_price: 190,
        old_price: 290,
        category: "recintos",
        fecha:'2024-09-06',
        hora:'18:30',
        lugar: 'La Trastienda Club',
        ubicacion:'Balcarce 460',
        stock: 100
    },
    {
        id: 12,
        name: "Hip Hop Hangout",
        image: hiphop,
        new_price: 110,
        old_price: 210,
        category: "recintos",
        fecha:'2024-11-27',
        hora:'18:30',
        lugar: 'Teatro Vorterix',
        ubicacion:'Av. Federico Lacroze 3455',
        stock: 100
    },
    {
        id: 13,
        name: "Rockin' Raucous",
        image: rock,
        new_price: 170,
        old_price: 270,
        category: "recintos",
        fecha:'2024-09-15',
        hora:'18:30',
        lugar: 'Luna Park',
        ubicacion:'Av. Eduardo Madero 420',
        stock: 100
    },
    {
        id: 14,
        name: "Latin Fiesta",
        image: latin,
        new_price: 150,
        old_price: 250,
        category: "recintos",
        fecha:'2024-08-19',
        hora:'18:30',
        lugar: 'Teatro Gran Rex',
        ubicacion:'Av. Corrientes 857',
        stock: 100
    },
    {
        id: 15,
        name: "Karaoke Kingdom",
        image: karaoke,
        new_price: 100,
        old_price: 200,
        category: "recintos",
        fecha:'2024-07-10',
        hora:'18:30',
        lugar: 'Niceto Club',
        ubicacion:'Av. Cnel. Niceto Vega 5510',
        stock: 100
    },
    {
        id: 16,
        name: "Carnival Carnival",
        image: carnival,
        new_price: 220,
        old_price: 320,
        category: "recintos",
        fecha:'2024-09-20',
        hora:'18:30',
        lugar: 'Teatro Vorterix',
        ubicacion:'Av. Federico Lacroze 3455',
        stock: 100
    },
    {
        id: 17,
        name: "Funky Town",
        image: funky_town,
        new_price: 170,
        old_price: 270,
        category: "recintos",
        fecha:'2024-05-31',
        hora:'18:30',
        lugar: 'La Trastienda Club',
        ubicacion:'Balcarce 460',
        stock: 100
    },
    {
        id: 18,
        name: "Mystic Masquerade",
        image: masquerade,
        new_price: 200,
        old_price: 300,
        category: "recintos",
        fecha:'2024-04-14',
        hora:'18:30',
        lugar: 'Luna Park',
        ubicacion:'Av. Eduardo Madero 420',
        stock: 100
    },
    {
        id: 19,
        name: "Salsa Soiree",
        image: salsa,
        new_price: 140,
        old_price: 240,
        category: "recintos",
        fecha:'2024-03-18',
        hora:'18:30',
        lugar: 'Teatro Vorterix',
        ubicacion:'Av. Federico Lacroze 3455',
        stock: 100
    },
    {
        id: 20,
        name: "Techno Temple",
        image: techno,
        new_price: 180,
        old_price: 280,
        category: "recintos",
        fecha:'2024-08-11',
        hora:'18:30',
        lugar: 'La Trastienda Club',
        ubicacion:'Balcarce 460',
        stock: 100
    },

    {
        id: 21,
        name: "Duki",
        image: duki,
        new_price: 220,
        category: "artistas",
        fecha:'2024-07-05',
        hora:'18:30',
        lugar: 'Niceto Club',
        ubicacion:'Av. Cnel. Niceto Vega 5510',
        stock: 100

    },
    {
        id: 22,
        name: "Bad Bunny",
        image: badBunny,
        new_price: 220,
        category: "artistas",
        fecha:'2024-12-31',
        hora:'18:30',
        lugar: 'Luna Park',
        ubicacion:'Av. Eduardo Madero 420',
        stock: 100
    },
    {
        id: 23,
        name: "Tini",
        image: tini,
        new_price: 220,
        category: "artistas",
        fecha:'2024-11-15',
        hora:'18:30',
        lugar: 'La Trastienda Club',
        ubicacion:'Balcarce 460',
        stock: 100
    },
    {
        id: 24,
        name: "Karol G",
        image: karolG,
        category: "artistas",
        new_price: 220,
        fecha:'2024-05-14',
        hora:'18:30',
        lugar: 'Teatro Vorterix',
        ubicacion:'Av. Federico Lacroze 3455',
        stock: 100
    },
    {
        id: 25,
        name: "Daddy Yankee",
        image: daddyYankee,
        category: "artistas",
        new_price: 220,
        fecha:'2024-05-19',
        hora:'18:30',
        lugar: 'Luna Park',
        ubicacion:'Av. Eduardo Madero 420',
        stock: 100
    },
    {
        id: 26,
        name: "Lali",
        image: lali,
        category: "artistas",
        new_price: 220,
        fecha:'2024-08-01',
        hora:'18:30',
        lugar: 'Teatro Gran Rex',
        ubicacion:'Av. Corrientes 857',
        stock: 100
    }
    
];
export default all_parties;
