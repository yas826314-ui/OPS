const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const fs = require('fs');

/* =========================================================
   🔑 حط توكن البوت هنا
   ========================================================= */

const TOKEN = process.env.GAMES_TOKEN;

/* =========================================================
   ⚙️ إعدادات البوت
   ========================================================= */

const GAME_CHANNEL_ID = '1547409593972559922';
const POINTS_FILE = './game_points.json';

/* =========================================================
   🎮 وقت اللعبة
   ========================================================= */

const GAME_TIME = 10000;

/* =========================================================
   🎮 صور وأجوبة لعبة أسرع
   ========================================================= */

const QUESTIONS = [
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420434449043476/1.png?ex=6ab9c495&is=6ab87315&hm=703d3509c37db6bebe0c637cb7896c1c3b6e2abc7fcd90a58f6ff7004ad13bb7&',
        answers: ['السرير']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420563155329024/2.png?ex=6ab9c4b3&is=6ab87333&hm=a51c22d7ec3348f4bb0fcb57ecbb6bbb2e6b90df6f27b1ff16056f66863cd95e&',
        answers: ['الإبرة', 'الابرة']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420577701302302/3.png?ex=6ab9c4b7&is=6ab87337&hm=3b70093f4e1af8c1f5fc4caeacb7facb732f949f38b512b4001f006128dc74c8&',
        answers: ['بيت الشعر']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420605400223804/4.png?ex=6ab9c4be&is=6ab8733e&hm=e10f1dd690af5093425d02a52b3bdfb8a3f73d952761553fcd9e5bbbda69be08&',
        answers: ['بحر']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420639973998683/5.png?ex=6ab9c4c6&is=6ab87346&hm=1297173f86aaf60568eaae524f6425eb1011c3d525f3a2eb5ada4d927378a833&',
        answers: ['المظلة', 'المظله']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420657933877318/6.png?ex=6ab9c4ca&is=6ab8734a&hm=09bf6f3dafcefb1494dd7097d299d14a9aa9e95f8e32d2ee034bc473730a3838&',
        answers: ['اسمك']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420690146271364/7.png?ex=6ab9c4d2&is=6ab87352&hm=4108e099f8a07df1e30187b5e0faab5c55b31f3fd293b928269e0803e05fea0f&',
        answers: ['السحاب']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420708651667456/8.png?ex=6ab9c4d6&is=6ab87356&hm=e094e92d2f98de740884bc18ca487edafae983ab37e022db30adf4d72e6d95d5&',
        answers: ['المطر']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420733645262898/9.png?ex=6ab9c4dc&is=6ab8735c&hm=cec37232cbbf5b32a817a34d2958aafde92848c7697db636b5182941fbfd8f6f&',
        answers: ['الحائط']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420756281917440/10.png?ex=6ab9c4e1&is=6ab87361&hm=6aa345acc4737bdae59d27a1eb6dc67a830225ec04bb22be593c2faaa6369dcd&',
        answers: ['كل الشهور']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420769871728670/11.png?ex=6ab9c4e5&is=6ab87365&hm=97050c885bd97d499b9665dac35e1ca2a2a183918fe54625b789e0596338d0bb&',
        answers: ['أنت', 'انت']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420792982077620/12.png?ex=6ab9c4ea&is=6ab8736a&hm=c119866655cbabfefc6555ecbec3421e37c3b09e522e901a4aac78fdbebd2776&',
        answers: ['المشط']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420807800561704/13.png?ex=6ab9c4ee&is=6ab8736e&hm=28f15f310a08a0caaf8c7e304f604c50a6bd4446769789cfa43694ad6305e7ef&',
        answers: ['الإسفنج', 'الاسفنج']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420827182702672/14.png?ex=6ab9c4f2&is=6ab87372&hm=4c1747f3dbe827bce9bc5410c8ad774d8a82b511c23ddacb3009a7110e2a8274&',
        answers: ['عطارد']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420843380838410/15.png?ex=6ab9c4f6&is=6ab87376&hm=ad9087b1ee023a161c73f84a56090ee744607934eea4ab0aace0aa1bea9cb8bf&',
        answers: ['ويليام شكسبير']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420857536610444/16.png?ex=6ab9c4fa&is=6ab8737a&hm=9c7100d442497da9137b77ab7708c0ce5aea18739816ce1fd4b918be25e79abb&',
        answers: ['سلوفينيا']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420875450486814/17.png?ex=6ab9c4fe&is=6ab8737e&hm=38a432307451599891c65be0a3a772d10499816e8173ea6df9cbca0e684dbc34&',
        answers: ['الزئبق']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420885634392134/18.png?ex=6ab9c500&is=6ab87380&hm=12629d933fa018db43219fd2bd7a5e9cb6c60b6c083569f5554227033fb8cc18&',
        answers: ['أزواج', 'ازواج']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420908011003984/19.png?ex=6aa35b86&is=6aa20a06&hm=6c46caacad150d282fd4bfc8b83dfb0e308eb0bd4c5610f9c1d5917423116773&',
        answers: ['اليعسوب']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420920916738069/20.png?ex=6ab9c509&is=6ab87389&hm=d0c2c619a37dbfb9c0d057d072622795d7a7108c26be87bc65d5005b074346f1&',
        answers: ['عام 1989', '1989']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420937199034439/21.png?ex=6ab9c50d&is=6ab8738d&hm=ccb84e9730adaff476fd8f02f19eb44c09843b1c66a708de0c5ccd0b56b26e3a&',
        answers: ['قلوب']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420958787248138/22.png?ex=6ab9c512&is=6ab87392&hm=df66af3df25a6b96d1cb2b334304979c0d4fa25554c0516e59cc4a76fa6049b8&',
        answers: ['كانبرا']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420976436879411/23.png?ex=6ab9c516&is=6ab87396&hm=e1196d60878e841236befcf25c553501cb6d181f5a1afca5ef746d56f3b4cf31&',
        answers: ['خندق ماريانا']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547420993008574514/24.png?ex=6ab9c51a&is=6ab8739a&hm=dc210816cff9948e4ea9e0d95430fdf923faaed50a1e41f549223e6a50c877e2&',
        answers: ['الهيدروجين']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421007466336316/25.png?ex=6ab9c51d&is=6ab8739d&hm=fd82bed5d99049d91ef2d602a224800e13bbd0e6c747784b0682f6a8bfa66e60&',
        answers: ['أفلاطون', 'افلاطون']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421019776491611/26.png?ex=6ab9c520&is=6ab873a0&hm=ee2e75b12c7baeacf1810e380cc10afe6bc2622a636a782f2f29f7a72447c7f7&',
        answers: ['السويد']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421038328029284/27.png?ex=6ab9c525&is=6ab873a5&hm=7587c1780c117644c3b871de802b42240fd6122453ea551b0f1fec5a8f87014e&',
        answers: ['أكسيد الديوتيريوم', 'اكسيد الديوتيريوم']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421054471766046/28.png?ex=6ab9c529&is=6ab873a9&hm=5e5053cb94852702a76fb069f7f585112a8d36514e55130b75a455063f1831bd&',
        answers: ['الطائر الطنان']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421076265504838/29.png?ex=6ab9c52e&is=6ab873ae&hm=c6f56f89a9db205dda1cf3c57b33b8021d42d30c9a28c2557029195dc0986cb8&',
        answers: ['كورفت', 'كورفيت']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421090232401981/30.png?ex=6ab9c531&is=6ab873b1&hm=5b1ab5be8f8826e9bc3adcd8a0bb6986fcb8b1c908fd5ef0e2a942647875ff55&',
        answers: ['مستحب']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421101527932928/31.png?ex=6ab9c534&is=6ab873b4&hm=b246be2f2d3031834fd996d62e7511bd08631934415cbc8c6ec25c7e92d87d02&',
        answers: ['غابات الامازون', 'غابات الأمازون']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421115473727608/32.png?ex=6ab9c537&is=6ab873b7&hm=af41196cf5c72281a82a95b05976a971ff2fabb2d5795270be28e9be7911d21c&',
        answers: ['كأس العالم', 'كاس العالم']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421126689292380/33.png?ex=6ab9c53a&is=6ab873ba&hm=112993df1b8f04a0108867646c67939a8f823bc13832ed6a034521fe0e2b953e&',
        answers: ['فورت نايت']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421142690562058/34.png?ex=6ab9c53e&is=6ab873be&hm=935297d52128cc236ba6ba8a369f829c05751bcf2657a61e77b615b80933a3e6&',
        answers: ['يوتيوب']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421170125770812/35.png?ex=6ab9c544&is=6ab873c4&hm=2b11da307bedd782e7047f3d804cd1e806797a9ba918d6ba6fa6d0490ff13cd9&',
        answers: ['المشتري']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421184021495858/36.png?ex=6ab9c547&is=6ab873c7&hm=391c285230b6adaf6cde0bd1b629b227a06917ab746d9d86b07c5a690346a728&',
        answers: ['سوبر ماركت']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421199326248970/37.png?ex=6ab9c54b&is=6ab873cb&hm=d47895be2d3a087f91496ec35c78e118602b958eb71c36235746f526d5e9b445&',
        answers: ['حلونجي']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421213402599525/38.png?ex=6ab9c54e&is=6ab873ce&hm=1f8eb3482abba3f15ce5f282f4714f9fd46ca2360e1e5c092835102674237d8d&',
        answers: ['خرافي']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421230758625291/39.png?ex=6ab9c553&is=6ab873d3&hm=2f64f457ed5c02d9621d4f1df3e656f2958705895a7d79f69c4372390ad82474&',
        answers: ['مطعم']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421241881661600/40.png?ex=6ab9c555&is=6ab873d5&hm=ecfe695c78d2ff657e063f4a386dc8fb79e32e2b38a856fffbbfb27dc67481cc&',
        answers: ['دبرني']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421256880758825/41.png?ex=6ab9c559&is=6ab873d9&hm=5c1151230a4fe6973acc12bb5dbec44caef72d6614f91f957c2a16855a4d2323&',
        answers: ['مستقبل']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421272856596580/42.png?ex=6ab9c55d&is=6ab873dd&hm=3d26494ab02c8db3f481c23db17dd7907700c81810f3cb4132e248f52c74e2b0&',
        answers: ['Victory', 'victory']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421286450470984/43.png?ex=6ab9c560&is=6ab873e0&hm=b4e3ce6890135b12b95defc3bfaf685e9030f21b8d0143415204fb27bfa90bc8&',
        answers: ['Legend', 'legend']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421296823115836/44.png?ex=6ab9c562&is=6ab873e2&hm=8fef34f7d85c7baa2fe280b9f404c88b62e702ee08015ecf076588b987fd8c75&',
        answers: ['Danger', 'danger']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421313352863784/45.png?ex=6ab9c566&is=6ab873e6&hm=a62e039733f770a82612c880d767d69cc4b197034e4f725ef6b0b4f2336f413d&',
        answers: ['Shadow', 'shadow']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1544321359147049051/1547421339021877278/46.png?ex=6ab9c56c&is=6ab873ec&hm=302afb19a48b3288ee95c5347e78179b09e17cb9f12296758b4e0ee4e67b73b4&',
        answers: ['ops', 'OPS', 'Ops']
    }
];

/* =========================================================
   📝 صور وأجوبة لعبة الشعر
   ========================================================= */

const POETRY_QUESTIONS = [
    {
        image: 'https://cdn.discordapp.com/attachments/1547571126736134144/1547571307875541062/72410f01790dffa5.png?ex=6aa3e798&is=6aa29618&hm=833e5bec68aaa0480bb9b7e2b1c3f6ec38a36d0ebb596ce9e14d44be471edcbb&',
        answers: ['عنترة بن شداد']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1547571126736134144/1547571496212242604/1.png?ex=6aa3e7c5&is=6aa29645&hm=d24dee527866251dc26cafe2b27d98955eed1f86041827a5566fe5779b0495a8&',
        answers: ['عنترة بن شداد']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1547571126736134144/1547572277833367592/3.png?ex=6aa3e87f&is=6aa296ff&hm=4f3fd426a771e2f36eb1e18006b1687bda3c38c1c8609c6df5fa0cac65afbb3e&',
        answers: ['ابو الطيب المتنبي', 'المتنبي']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1547571126736134144/1547572303653511244/2.png?ex=6aa3e885&is=6aa29705&hm=640d37bdb3a9924c7f93c43d5e86cc2363f8b27ae9cefb3deb3fdbfc6c69af27&',
        answers: ['ابو الطيب المتنبي', 'المتنبي']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1547571126736134144/1547573312568172655/5.png?ex=6aa3e976&is=6aa297f6&hm=7ffd5a19a1d15c69d287239032facb9550187e65a73a253c929995f4f6a71aab&',
        answers: ['تركي الميزاني']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1547571126736134144/1547573353559359528/4.png?ex=6aa3e980&is=6aa29800&hm=10bc52e5f6f33b118c14a2d04cde7518096200e40723729bfc71ec749a14d77e&',
        answers: ['تركي الميزاني']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1547571126736134144/1547573918309556254/6.png?ex=6aa3ea06&is=6aa29886&hm=0e7afb12438ce8ee32acc52b8b08993aed66f5a63491b3bf959ed7d125ae50b8&',
        answers: ['علي الحارثي']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1547571126736134144/1547573937213407264/7.png?ex=6aa3ea0b&is=6aa2988b&hm=6ed36a3517fcdf2233850b75b264688539023e0e000e46b9bfa8d4be3aeed83b&',
        answers: ['علي الحارثي']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1547571126736134144/1547574424167784461/8.png?ex=6aa3ea7f&is=6aa296?&hm=d3253026f23890eb773b90e524bbd4b578b16c1a1ab994b896215c0f20b224e8&',
        answers: ['خلف بن هذال']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1547571126736134144/1547574450902540348/9.png?ex=6aa3ea85&is=6aa29905&hm=fd69efb6fdaa0e8634a1bc3b3bad737afe625aa758fe563d0c6a96bfb2016363&',
        answers: ['خلف بن هذال']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1547571126736134144/1547574499757531307/10.png?ex=6aa3ea91&is=6aa29911&hm=dfe5abe843d2ceee789df7097fa7a3ae0592a1d8f2e07bedf5124d6808b9b789&',
        answers: ['خلف بن هذال']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1547571126736134144/1547574450902540348/9.png?ex=6aa3ea85&is=6aa29905&hm=fd69efb6fdaa0e8634a1bc3b3bad737afe625aa758fe563d0c6a96bfb2016363&',
        answers: ['خلف بن هذال']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1547571126736134144/1547575637999358043/12.png?ex=6aa3eba0&is=6aa29a20&hm=4598b4fe0b466005eefc65b973d7e3aebb063e769b94915b236fb39880a1fc5a&',
        answers: ['مساعد الرشيدي']
    },
    {
        image: 'https://cdn.discordapp.com/attachments/1547571126736134144/1547575797701681212/13.png?ex=6aa3ebc6&is=6aa29a46&hm=36cb89a63f5b9c831291211f9b93ced9428d270bb72621f73b0bde1ad002ffb2&',
        answers: ['مساعد الرشيدي']
    }
];

/* =========================================================
   💾 تحميل النقاط
   ========================================================= */

let points = {};

if (fs.existsSync(POINTS_FILE)) {
    try {
        points = JSON.parse(
            fs.readFileSync(POINTS_FILE, 'utf8')
        );
    } catch {
        points = {};
    }
}

function savePoints() {
    fs.writeFileSync(
        POINTS_FILE,
        JSON.stringify(points, null, 2),
        'utf8'
    );
}

/* =========================================================
   🧹 تنظيف الإجابات
   ========================================================= */

function normalize(text) {
    return String(text || '')
        .toLowerCase()
        .trim()
        .replace(/[أإآ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/[ًٌٍَُِّْـ]/g, '')
        .replace(/\s+/g, ' ');
}

/* =========================================================
   🤖 البوت
   ========================================================= */

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

/*
 * كل لعبة مستقلة عن الثانية
 *
 * اسرع -> currentGames.asra
 * شعر  -> currentGames.poetry
 */

const currentGames = {
    asra: null,
    poetry: null
};

/* =========================================================
   🔢 اختيار سؤال عشوائي
   ========================================================= */

function getRandomQuestion(questions) {
    return questions[
        Math.floor(Math.random() * questions.length)
    ];
}

/* =========================================================
   🎮 أسماء الألعاب
   ========================================================= */

function getGameName(type) {
    if (type === 'asra') return 'اسرع';
    if (type === 'poetry') return 'شعر';
    return 'اللعبة';
}

/* =========================================================
   🚫 رسالة وجود لعبة من نفس النوع
   ========================================================= */

async function sendAlreadyRunning(message, type) {
    const gameName = getGameName(type);

    const embed = new EmbedBuilder()
        .setColor('#D4AC0D')
        .setDescription(
            `[:ii:](https://cdn.discordapp.com/emojis/1540666983228506172.webp?size=56) - هناك لعبة **${gameName}** قيد التشغيل بالفعل في هذا الشات! انتظر حتى تنتهي.`
        );

    return message.reply({
        embeds: [embed],
        allowedMentions: {
            repliedUser: false
        }
    });
}

/* =========================================================
   🚀 بدء لعبة
   ========================================================= */

async function startGame(message, type, questions) {
    if (currentGames[type]) {
        return sendAlreadyRunning(message, type);
    }

    const question = getRandomQuestion(questions);

    const game = {
        question,
        answered: false,
        messageId: null,
        timer: null
    };

    currentGames[type] = game;

    try {
        const gameMessage = await message.channel.send({
            files: [question.image]
        });

        game.messageId = gameMessage.id;
    } catch (error) {
        console.error('خطأ أثناء إرسال الصورة:', error);

        currentGames[type] = null;
        return;
    }

    game.timer = setTimeout(async () => {
        const activeGame = currentGames[type];

        if (!activeGame) return;

        if (activeGame.answered) return;

        activeGame.answered = true;
        currentGames[type] = null;

        try {
            const embed = new EmbedBuilder()
                .setColor('#87CEEB')
                .setDescription(
                    '**انتهى الوقت! لم يفز احد**'
                );

            await message.channel.send({
                embeds: [embed]
            });
        } catch (error) {
            console.error(
                'خطأ أثناء إرسال انتهاء الوقت:',
                error
            );
        }
    }, GAME_TIME);
}

/* =========================================================
   🏆 إعطاء نقطة
   ========================================================= */

function addPoint(userId) {
    if (!points[userId]) {
        points[userId] = 0;
    }

    points[userId] += 1;

    savePoints();

    return points[userId];
}

/* =========================================================
   ✅ البوت جاهز
   ========================================================= */

client.once('ready', () => {
    console.log(
        `تم تشغيل بوت الألعاب: ${client.user.tag}`
    );
});

/* =========================================================
   🎮 استقبال الرسائل
   ========================================================= */

client.on('messageCreate', async message => {
    try {
        if (message.author.bot) return;

        if (message.channel.id !== GAME_CHANNEL_ID) {
            return;
        }

        const content = normalize(message.content);

        /* =====================================================
           🚀 أمر اسرع
           ===================================================== */

        if (
            content === '-اسرع' ||
            content === '!اسرع' ||
            content === 'اسرع'
        ) {
            return startGame(
                message,
                'asra',
                QUESTIONS
            );
        }

        /* =====================================================
           📝 أوامر الشعر
           قصيدة
           قصائد
           شعر
           شاعر
           ===================================================== */

        if (
            content === '2102' ||
            content === '21021' ||
            content === '12121' ||
            content === '021021'
        ) {
            return startGame(
                message,
                'poetry',
                POETRY_QUESTIONS
            );
        }

        /* =====================================================
           🛑 التحقق من ألعاب اسرع وشعر
           ===================================================== */

        const activeGames = [];

        if (currentGames.asra) {
            activeGames.push('asra');
        }

        if (currentGames.poetry) {
            activeGames.push('poetry');
        }

        if (activeGames.length === 0) {
            return;
        }

        /* =====================================================
           🔍 البحث عن إجابة صحيحة
           ===================================================== */

        for (const type of activeGames) {
            const game = currentGames[type];

            if (!game) continue;

            if (game.answered) continue;

            const isCorrect = game.question.answers.some(
                answer =>
                    normalize(answer) === content
            );

            if (!isCorrect) {
                continue;
            }

            /* =================================================
               🛑 أول شخص يجاوب
               ================================================= */

            game.answered = true;

            if (game.timer) {
                clearTimeout(game.timer);
                game.timer = null;
            }

            /* =================================================
               ⭐ إضافة نقطة
               النقاط مشتركة بين اسرع وشعر
               ================================================= */

            const newPoints = addPoint(
                message.author.id
            );

            currentGames[type] = null;

            /* =================================================
               🏆 الرد على رسالة الشخص بدون منشن
               ================================================= */

            const pointsButton = new ButtonBuilder()
                .setCustomId(
                    `game_points_${message.author.id}_${Date.now()}`
                )
                .setLabel(
                    `⭐ ${newPoints} (+1)`
                )
                .setStyle(
                    ButtonStyle.Secondary
                )
                .setDisabled(true);

            const row = new ActionRowBuilder()
                .addComponents(pointsButton);

            try {
                await message.reply({
                    content: `**إجابة صحيحة!**\n**+1**`,
                    components: [row],
                    allowedMentions: {
                        repliedUser: false
                    }
                });
            } catch (error) {
                console.error(
                    'خطأ أثناء إرسال نتيجة الفوز:',
                    error
                );

                try {
                    await message.channel.send({
                        content: `**إجابة صحيحة!**\n**+1**`,
                        components: [row]
                    });
                } catch (secondError) {
                    console.error(
                        'خطأ إضافي أثناء إرسال نتيجة الفوز:',
                        secondError
                    );
                }
            }

            /*
             * الإجابة الواحدة تنهي اللعبة التي أجاب عليها الشخص.
             */
            return;
        }

    } catch (error) {
        console.error(
            '❌ حدث خطأ:',
            error
        );
    }
});

/* =========================================================
   🔌 تسجيل الدخول
   ========================================================= */

client.login(TOKEN);