"use strict";
let csv = require('fast-csv')
let fs = require('fs')

let utils = require('./utils')

let primary_List = [];
let secondary_List = [];

csv.fromStream(fs.createReadStream('data/primary-pref.csv'), { headers: true })
    .transform(row => {
        if (row['A'] != "") {
            return {
                A: utils.cleanObject(row['A']),
                B: utils.cleanObject(row['B']),
                C: utils.formatDate(utils.cleanObject(row['C']), 'YYYY/MM/DD'),
                D: utils.cleanObject(row['D']),
                E: utils.cleanObject(row['E']),
                F: utils.cleanObject(row['F']),
                key: utils.cleanObject(row['A']) + ":" + utils.cleanObject(row['B']) + ":" + utils.cleanObject(row['C'] + ":" + utils.cleanObject(row['D']) + ":" + utils.cleanObject(row['E']) + ":" + utils.cleanObject(row['F']))
            }
        }
    })
    .on('data', row => {
        primary_List.push(row);
    })
    .on('end', () => {
        console.log("Primary Data Read Done.. " + primary_List.length)
        csv.fromStream(fs.createReadStream('data/secondary-audit.csv'), { headers: true })
            .transform(row => {
                if (row['A'] != "") {
                    return {
                        A: utils.cleanObject(row['A']),
                        B: utils.cleanObject(row['B']),
                        C: utils.formatDate(utils.cleanObject(row['C']), 'MM/DD/YYYY'),
                        D: utils.cleanObject(row['D']),
                        E: utils.cleanObject(row['E']),
                        F: utils.cleanObject(row['F']),
                        key: utils.cleanObject(row['A']) + ":" + utils.cleanObject(row['B']) + ":" + utils.cleanObject(row['C'] + ":" + utils.cleanObject(row['D']) + ":" + utils.cleanObject(row['E'] + ":" + utils.cleanObject(row['F'])))
                    }
                }
            })
            .on('data', row => {
                secondary_List.push(row);
            })
            .on('end', () => {
                console.log("Secondary Data Read Done.. " + secondary_List.length)

                let primary_Duplicats = [];
                let secondary_Duplicats = [];

                let primary_Filtered = utils.filter(utils.sort(primary_List), primary_Duplicats)
                let secondary_Filtered = utils.filter(utils.sort(secondary_List), secondary_Duplicats)
                let results = utils.flatten(utils.compare(primary_Filtered, secondary_Filtered));

                write(results, "results");
                write(primary_Filtered, "primary_Filtered");
                write(primary_Duplicats, "primary_Duplicats");
                write(secondary_Filtered, "secondary_Filtered");
                write(secondary_Duplicats, "secondary_Duplicats");

                let primary_only = [];
                let secondary_only = [];
                let match_only = [];

                utils.split(results, primary_only, secondary_only, match_only);

                write(primary_only, "primary_only");
                write(secondary_only, "secondary_only");
                write(match_only, "match_only");

            })
    })

const write = (data, name) => {
    if (data.length !== 0) {
        csv.writeToStream(fs.createWriteStream("data/processed/" + name + ".csv"), data, {
            headers: true
        }).on("finish", function () {
            console.log("Done with: " + name + " : " + data.length);
        });
    } else {
        console.log("No data for: " + name);
    }
}