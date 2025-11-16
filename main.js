const input = document.querySelector('#inputField');
var active;
var data;
var answers = [0, 0, 0, 0, 0];
var firstTimeUse = [1, 1, 1, 1, 1];
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
    let demon = document.querySelector('#demonContainer');
    let welcome = document.querySelector('#mainPage');
    let winPage = document.querySelector('#winPage');

    add.style.display = 'none';
    substr.style.display = 'none';
    multi.style.display = 'none';
    divis.style.display = 'none';
    demon.style.display = 'none';
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
    } else if (type == 'Demon') {
        curr = demon;
        currNum = 4;
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
        curr.querySelector('.streakCount').innerText = data.streak;
        curr.querySelector('.goodBad img').style.display = 'none';

        if (firstTimeUse[currNum]) {
            firstTimeUse[currNum] = 0;
            const inputField = curr.querySelector('.answerField');
            inputField.addEventListener('input', function (e) {
                if (inputField.value == answers[currNum]) {
                    curr.querySelector('.goodBad img').src =
                        'media/tick-svgrepo-com.svg';
                    curr.querySelector('.goodBad img').style.display = 'block';
                    let multi = 1;
                    if (data.streak > 16) {
                        multi = 4;
                    } else if (data.streak > 8) {
                        multi = 3;
                    } else if (data.streak > 3) {
                        multi = 2;
                    }
                    data.progress[currNum] += 1 * multi;
                    data.streak += 1;
                    inputField.value = '';
                    while (data.progress[currNum] >= 10) {
                        data.levels[currNum] += 1;
                        data.progress[currNum] -= 10;
                    }
                    setCookieObject('data', data);
                    setTimeout(setupGame, 1000, active);
                } else if (
                    inputField.value.length ==
                    answers[currNum].toString().length
                ) {
                    data.streak = 0;
                    curr.querySelector('.streakCount').innerText = data.streak;
                    curr.querySelector('.goodBad img').src =
                        'media/cross-small-svgrepo-com.svg';
                    curr.querySelector('.goodBad img').style.display = 'block';
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
    } else if (type == 'Demon') {
        let level = data.levels[4];
        const ops = ['+', '-', '*', '/'];
        const length = level <= 5 ? 2 : level <= 10 ? 3 : level <= 15 ? 4 : 5;
        let maxNum =
            level <= 5 ? 10 : level <= 10 ? 20 : level <= 15 ? 50 : 100;
        function getNumber() {
            return Math.floor(Math.random() * maxNum) + 1;
        }
        function getSafeDivision(currentValue) {
            const divisors = [];
            for (let d = 1; d <= currentValue; d++) {
                if (currentValue % d === 0) divisors.push(d);
            }
            return divisors[Math.floor(Math.random() * divisors.length)];
        }
        let numbers = [];
        let operations = [];
        let first = getNumber();
        numbers.push(first);
        for (let i = 1; i < length; i++) {
            let op = ops[Math.floor(Math.random() * ops.length)];
            let num = getNumber();

            if (op === '/') {
                num = getSafeDivision(numbers[numbers.length - 1]);
            }
            operations.push(op);
            numbers.push(num);
        }
        let expression = numbers[0].toString();
        for (let i = 0; i < operations.length; i++) {
            expression += ' ' + operations[i] + ' ' + numbers[i + 1];
        }
        let result = eval(expression);
        if (!Number.isInteger(result)) return generateProblem(type);
        answers[4] = result;
        return expression;
    }
}
document.addEventListener('click', function (e) {
    //console.log(e.target.dataset.mode);
    if (
        e.target.dataset.mode == 'Addition' ||
        e.target.dataset.mode == 'Substraction' ||
        e.target.dataset.mode == 'Multiplication' ||
        e.target.dataset.mode == 'Division' ||
        e.target.dataset.mode == 'Demon'
    ) {
        setupGame(e.target.dataset.mode);
    } else if (e.target.id == 'appName') {
        let add = document.querySelector('#additionContainer');
        let substr = document.querySelector('#substractionContainer');
        let multi = document.querySelector('#multiplicationContainer');
        let divis = document.querySelector('#divisionContainer');
        let demon = this.documentElement.querySelector('#demonContainer');
        let welcome = document.querySelector('#mainPage');

        add.style.display = 'none';
        substr.style.display = 'none';
        multi.style.display = 'none';
        divis.style.display = 'none';
        demon.style.display = 'none';
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
        } else if (type == 'Demon') {
            currNum = 4;
        }
        data.levels[currNum] = 1;
        setupGame(active);
    } else if (e.target.id == 'guideButtonContainer') {
        document.querySelector('#popupInstructions').style.display = 'block';
        document.querySelector('#overlay').style.display = 'block';

        closePopupInput.value = '';
        closePopupInput.addEventListener('input', function (e) {
            if (closePopupInput.value == '4') {
                document.querySelector('#popupInstructions').style.display =
                    'none';
                document.querySelector('#overlay').style.display = 'none';
            }
        });
    }
});
window.addEventListener('load', () => {
    data = getCookieObject('data');
    if (!data) {
        data = {
            levels: [1, 1, 1, 1, 1],
            progress: [0, 0, 0, 0, 0],
            streak: 0,
        };
    }
    const closePopupInput = document.querySelector('#closePopupInput');
    let beenThere = getCookieObject('beenThere');
    if (!beenThere) {
        document.querySelector('#popupInstructions').style.display = 'block';
        document.querySelector('#overlay').style.display = 'block';
        closePopupInput.value = '';
        closePopupInput.addEventListener('input', function (e) {
            if (closePopupInput.value == '4') {
                document.querySelector('#popupInstructions').style.display =
                    'none';
                document.querySelector('#overlay').style.display = 'none';
            }
            setCookieObject('beenThere', 1);
        });
    }
    //console.log(data);
});
