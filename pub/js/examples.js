"use strict"

let myBetterTable = new BetterTable("BTStandardTable");

let myBetterTable2 = new BetterTable("addRowsColumns");
myBetterTable2.addRow(["11", "My New Team", 30, 15, 4, 4, 30, 20, 10, 42]);

let myBetterTable3 = new BetterTable("addColumns");
myBetterTable3.addColumn("Fav Teams", [5, 2, 4, 3, 6, 7, 9, 10, 11, 8, 1]);

let myBetterTable4 = new BetterTable("sortable");
myBetterTable4.addSortableHeaders();

let myBetterTable5 = new BetterTable("reorderable");
myBetterTable5.addSortableHeaders();
myBetterTable5.addReorderableColumns();

let myBetterTable6 = new BetterTable("searchable");
myBetterTable6.addSortableHeaders();
myBetterTable6.addReorderableColumns();
myBetterTable6.addSearchBar("Team");

let myBetterTable7 = new BetterTable("CSV");
myBetterTable7.addSortableHeaders();
myBetterTable7.addReorderableColumns();
myBetterTable7.addExportCSVButton();
myBetterTable7.addSearchBar("Team");
