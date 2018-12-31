"use strict";
const moment = require('moment');

function match(one, two) {
    return one.toUpperCase() === two.toUpperCase();
}

module.exports = {
    cleanObject: (object) => {
        if (object && (object !== '' || object !== '-' || object !== ' ')) {
            return object.replace(/^\s+|\s$|'/ig, '');
        } else {
            return '';
        }
    },
    formatDate: (object, format = undefined) => {
        if (object && (object !== '' || object !== '-' || object !== ' ')) {
            if (moment(object.substring(0, 10)).isValid()) {
                return moment(object.substring(0, 10), format).format('YYYY-MM-DD');
            } else {
                console.log(object.substring(0, 10));
                return object.substring(0, 10)
            }
        } else {
            return '';
        }
    },
    filter: (data, duplicates) => {
        console.log("Filtering.." + data.length);
        var parent = this;
        return data.filter(function (current, pos, self) {
            var prev = self[pos - 1];
            var next = self[pos + 1];
            if (prev && current.A === prev.A) {
                if (duplicates && !duplicates.find((dup) => dup.A === current.A)) {
                    duplicates.push(current)
                    return true;
                } else {
                    duplicates.push(current)
                    return false;
                }
            } else if (next && current.A === next.A) {
                if (duplicates && !duplicates.find((dup) => dup.A === current.A)) {
                    duplicates.push(current)
                    return true;
                } else {
                    duplicates.push(current)
                    return false;
                }
            } else {
                return true;
            }
        })
    },
    sort: (data) => {
        console.log("Sorting.." + data.length);
        return data.sort(function (a, b) {
            return a.A == b.A ? 0 : +(a.A > b.A) || -1;
        });
    },
    flatten: (data) => {
        console.log("Flattening..");
        var result = [];
        for (var A in data) {
            if (data.hasOwnProperty(A)) {
                result.push(data[A]);
            }
        }
        return result;
    },
    compare: (primary, secondary) => {
        console.log("Comparing primary: " + primary.length + " row with secondary: " + secondary.length + " rows thats a total rows of: " + (primary.length + secondary.length));
        var result = {};
        primary.forEach((item) => {
            result[item.A] = {
                primaryA: item.A,
                secondaryA: '',
                matchA: 'false',
                primaryB: item.B,
                secondaryB: '',
                matchB: 'false',
                primaryC: item.C,
                secondaryC: '',
                matchC: 'false',
                primaryD: item.D,
                secondaryD: '',
                matchD: 'false',
                primaryE: item.E,
                secondaryE: '',
                matchE: 'false',
                primaryF: item.F,
                secondaryF: '',
                matchF: 'false',
                result: 'primary'
            }
        });
        secondary.forEach((item) => {
            var primaryObject = result[item.A];
            if (primaryObject) {
                primaryObject.secondaryA = item.A;
                primaryObject.matchA = match(primaryObject.secondaryA, primaryObject.primaryA);
                primaryObject.secondaryB = item.B;
                primaryObject.matchB = match(primaryObject.secondaryB, primaryObject.primaryB);
                primaryObject.secondaryC = item.C;
                primaryObject.matchC = match(primaryObject.secondaryC, primaryObject.primaryC);
                primaryObject.secondaryD = item.D;
                primaryObject.matchD = match(primaryObject.secondaryD, primaryObject.primaryD);
                primaryObject.secondaryE = item.E;
                primaryObject.matchE = match(primaryObject.secondaryE, primaryObject.primaryE);
                primaryObject.secondaryF = item.F;
                primaryObject.matchF = match(primaryObject.secondaryF, primaryObject.primaryF);
                primaryObject.result = 'Match';
                result[item.A] = primaryObject;
            } else {
                result[item.A] = {
                    primaryA: '',
                    secondaryA: item.A,
                    matchA: 'false',
                    primaryB: '',
                    secondaryB: item.B,
                    matchB: 'false',
                    primaryC: '',
                    secondaryC: item.C,
                    matchC: 'false',
                    primaryD: '',
                    secondaryD: item.D,
                    matchD: 'false',
                    primaryE: '',
                    secondaryE: item.E,
                    matchE: 'false',
                    primaryF: '',
                    secondaryF: item.F,
                    matchF: 'false',
                    result: 'secondary'
                }
            }
        });
        return result;
    },
    split: (data, primary, secondary, match) => {
        data.forEach((item) => {
            switch (item.result) {
                case 'Match': {
                    match.push(item);
                    break;
                } case 'secondary': {
                    secondary.push(item);
                    break;
                } case 'primary': {
                    primary.push(item);
                    break;
                }
                default: {
                    break;
                }
            }
        });
    },
}