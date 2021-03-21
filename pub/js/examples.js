"use strict"

let myBetterTable = new BetterTable("initialization");

let myBetterTable2 = new BetterTable("addRowsColumns");
myBetterTable2.addRow(["11", "My New Team", 30, 15, 4, 4, 30, 20, 10, 42]);

let myBetterTable3 = new BetterTable("addColumns");
myBetterTable3.addColumn("Fav Teams", [5, 2, 4, 3, 6, 7, 9, 10, 11, 8, 1]);

let myBetterTable4 = new BetterTable("sort");
myBetterTable4.sortableHeaders();

let myBetterTable5 = new BetterTable("export");
myBetterTable5.sortableHeaders();
myBetterTable5.addExportCSVButton();