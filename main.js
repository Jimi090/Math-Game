const input = document.querySelector('#inputField');
var active;
var data;
var answers = [0, 0, 0, 0];
var firstTimeUse = [1, 1, 1, 1];
function setCookieObject(name, obj) {
    const value = encodeURIComponent(JSON.stringify(obj));
    const expires = 'Fri, 31 Dec 9999 23:59:59 GMT';
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}
function getCookieObject(name) {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = value;
        return acc;
    }, {});
    if (!cookies[name]) return null;
    try {
        return JSON.parse(decodeURIComponent(cookies[name]));
    } catch {
        return null;
    }
}
function setupGame(type) {
    let add = document.querySelector('#additionContainer');
    let substr = document.querySelector('#substractionContainer');
    let multi = document.querySelector('#multiplicationContainer');
    let divis = document.querySelector('#divisionContainer');
    let welcome = document.querySelector('#welcomePage');
    let winPage = document.querySelector('#winPage');

    add.style.display = 'none';
    substr.style.display = 'none';
    multi.style.display = 'none';
    divis.style.display = 'none';
    welcome.style.display = 'none';
    winPage.style.display = 'none';

    let curr;
    let currNum;
    if (type == 'Addition') {
        curr = add;
        currNum = 0;
    } else if (type == 'Substraction') {
        curr = substr;
        currNum = 1;
    } else if (type == 'Multiplication') {
        curr = multi;
        currNum = 2;
    } else if (type == 'Division') {
        curr = divis;
        currNum = 3;
    } else if (type == 'welcomePage') {
        curr = null;
        currNum = 1000;
    }
    active = type;
    if (data.levels[currNum] <= 20) {
        curr.style.display = 'flex';
        curr.querySelector('.levelNumber').innerText = data.levels[currNum];
        curr.querySelector('.progressBar').style.width =
            data.progress[currNum] * 10 + '%';
        curr.querySelector('.progressBarPrecent').innerText =
            data.progress[currNum] * 10 + '%';
        curr.querySelector('.gameProblem').innerText = generateProblem(type);
        if (firstTimeUse[currNum]) {
            firstTimeUse[currNum] = 0;
            const inputField = curr.querySelector('.answerField');
            inputField.addEventListener('input', function (e) {
                if (inputField.value == answers[currNum]) {
                    data.progress[currNum] += 1;
                    inputField.value = '';
                    if (data.progress[currNum] == 10) {
                        data.levels[currNum] += 1;
                        data.progress[currNum] = 0;
                    }
                    setCookieObject('data', data);
                    setupGame(active);
                    console.log(getCookieObject('data'));
                }
            });
        }
    } else {
        winPage.style.display = 'flex';
        winPage.querySelector('#winTypeText').innerText = type;
    }
}
function generateProblem(type) {
    if (type == 'Addition') {
        level = data.levels[0];
        const termCount = 2 + Math.floor((level - 1) / 5);
        const minValue = Math.floor(1 + (level - 1) * 5);
        const maxValue = Math.floor(20 + level * 25);
        const terms = Array.from(
            { length: termCount },
            () =>
                Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
        );
        const expression = terms.join(' + ');
        const answer = terms.reduce((a, b) => a + b, 0);
        answers[0] = answer;
        return expression;
    } else if (type == 'Substraction') {
        level = data.levels[1];
        const termCount = 2 + Math.floor((level - 1) / 5);
        const minValue = Math.floor(1 + (level - 1) * 5);
        const maxValue = Math.floor(20 + level * 25);

        let terms = Array.from(
            { length: termCount },
            () =>
                Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
        );

        const allowNegativeChance = Math.max(0, (level - 7) / 13);

        const allowNegative = Math.random() < allowNegativeChance;

        if (!allowNegative) {
            const smallTerms = terms.slice(1);
            const sumSmall = smallTerms.reduce((a, b) => a + b, 0);
            terms[0] =
                sumSmall + Math.floor(Math.random() * (maxValue / 2)) + 1;
        } else {
            terms.sort(() => Math.random() - 0.5);
        }

        const expression = terms.join(' - ');
        const answer = terms.reduce((a, b) => a - b);
        answers[1] = answer;
        return expression;
    } else if (type == 'Multiplication') {
        level = data.levels[2];
        let factorCount;
        if (level <= 5) factorCount = 2;
        else if (level <= 10) factorCount = 2 + (Math.random() < 0.3 ? 1 : 0);
        else if (level <= 15) factorCount = 3;
        else factorCount = 3 + (Math.random() < 0.4 ? 1 : 0);

        const minValue = Math.max(1, Math.floor(1 + (level - 1) * 0.5));
        const maxValue = Math.min(25, Math.floor(10 + level * 0.8));

        const factors = Array.from(
            { length: factorCount },
            () =>
                Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
        );
        const expression = factors.join(' × ');
        const answer = factors.reduce((a, b) => a * b, 1);
        answers[2] = answer;
        return expression;
    } else if (type == 'Division') {
        level = data.levels[3];
        const minValue = 20 + level * 5;
        const maxValue = 50 + level * 15;
        const divisor =
            Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const quotient = Math.floor(Math.random() * (10 + level * 2)) + 2;
        const dividend = divisor * quotient;
        const expression = `${dividend} ÷ ${divisor}`;
        const answer = quotient;
        answers[3] = answer;
        return expression;
    }
}
document.addEventListener('click', function (e) {
    if (
        e.target.id == 'Addition' ||
        e.target.id == 'Substraction' ||
        e.target.id == 'Multiplication' ||
        e.target.id == 'Division'
    ) {
        setupGame(e.target.id);
    } else if (e.target.id == 'appName') {
        let add = document.querySelector('#additionContainer');
        let substr = document.querySelector('#substractionContainer');
        let multi = document.querySelector('#multiplicationContainer');
        let divis = document.querySelector('#divisionContainer');
        let welcome = document.querySelector('#welcomePage');

        add.style.display = 'none';
        substr.style.display = 'none';
        multi.style.display = 'none';
        divis.style.display = 'none';
        welcome.style.display = 'block';
        winPage.style.display = 'none';
    } else if (e.target.id == 'restartButton') {
        let type = active;
        let currNum;
        if (type == 'Addition') {
            currNum = 0;
        } else if (type == 'Substraction') {
            currNum = 1;
        } else if (type == 'Multiplication') {
            currNum = 2;
        } else if (type == 'Division') {
            currNum = 3;
        }
        data.levels[currNum] = 1;
        setupGame(active);
    }
});
window.addEventListener('load', () => {
    data = getCookieObject('data');
    if (!data) {
        data = {
            levels: [1, 1, 1, 1],
            progress: [0, 0, 0, 0],
        };
    }
    console.log(data);
});
