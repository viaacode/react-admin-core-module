"use strict";
// noinspection ES6PreferShortImport
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This script will read all the nl.json files in all the repos and convert them to one big sql file for nl and en languages
 */
var fs = require("fs/promises");
var lodash_1 = require("lodash");
var path = require("path");
var translations_core_types_1 = require("../src/react-admin/modules/translations/translations.core.types");
var blend_promise_utils_1 = require("blend-promise-utils");
/**
 * Translates dutch text using ollama llm
 * https://gist.github.com/bertyhell/4b90cc283800150550c67abf80832aa3
 * @param dutchText
 */
function machineTranslate(dutchText) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt, body, headers, response, responseJson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prompt = 'translate this text from dutch to english. Answer only with the translated text that is between the quotes, nothing else: ```' +
                        dutchText +
                        '```';
                    body = JSON.stringify({
                        model: 'llama3',
                        prompt: prompt,
                        stream: false,
                    });
                    headers = new Headers();
                    headers.append('Content-Type', 'application/json');
                    return [4 /*yield*/, fetch('http://localhost:11434/api/generate', {
                            body: body,
                            method: 'POST',
                            headers: headers,
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    responseJson = _a.sent();
                    return [2 /*return*/, (0, lodash_1.trim)(responseJson.response, '\'"`')];
            }
        });
    });
}
function migrateTranslations(rootFolderPath, app, component, outputJsonFile) {
    return __awaiter(this, void 0, void 0, function () {
        var nlJsonTranslations, _a, _b, nlTranslationEntries_1, englishTranslationEntries, err_1;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, fs.readFile(path.resolve(rootFolderPath, outputJsonFile))];
                case 1:
                    nlJsonTranslations = _b.apply(_a, [(_c.sent()).toString()]);
                    nlTranslationEntries_1 = Object.entries(nlJsonTranslations).map(function (entry) {
                        return {
                            app: app,
                            component: component,
                            location: entry[0].split(translations_core_types_1.TRANSLATION_SEPARATOR)[0],
                            key: entry[0].split(translations_core_types_1.TRANSLATION_SEPARATOR)[1],
                            language: translations_core_types_1.Locale.Nl,
                            value: entry[1],
                            value_type: null,
                        };
                    });
                    englishTranslationEntries = [];
                    if (!(app === translations_core_types_1.App.HET_ARCHIEF)) return [3 /*break*/, 3];
                    console.log('Translating ' + nlTranslationEntries_1.length + ' translations');
                    return [4 /*yield*/, (0, blend_promise_utils_1.mapLimit)(nlTranslationEntries_1, 10, function (nlTranslationEntry, i) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        console.log('Translating ' + i + ' / ' + nlTranslationEntries_1.length + ' translations');
                                        _a = [__assign({}, nlTranslationEntry)];
                                        _b = { language: translations_core_types_1.Locale.En };
                                        return [4 /*yield*/, machineTranslate(nlTranslationEntry.value)];
                                    case 1: return [2 /*return*/, __assign.apply(void 0, _a.concat([(_b.value = _c.sent(), _b)]))];
                                }
                            });
                        }); })];
                case 2:
                    // Also include English entries
                    englishTranslationEntries = _c.sent();
                    _c.label = 3;
                case 3:
                    console.log('Translating ' + nlTranslationEntries_1.length + ' translations -- done');
                    return [2 /*return*/, __spreadArray(__spreadArray([], nlTranslationEntries_1, true), englishTranslationEntries, true)];
                case 4:
                    err_1 = _c.sent();
                    throw new Error(JSON.stringify({
                        message: 'Failed to update translations',
                        innerException: JSON.stringify(err_1, Object.getOwnPropertyNames(err_1)),
                        additionalInfo: {
                            rootFolderPath: rootFolderPath,
                            app: app,
                            component: component,
                            outputJsonFile: outputJsonFile,
                        },
                    }));
                case 5: return [2 /*return*/];
            }
        });
    });
}
function migrateAllTranslations() {
    return __awaiter(this, void 0, void 0, function () {
        var app, allTranslations, avoAdminCoreTranslations, avoClientTranslations, avoProxyTranslations, hetArchiefAdminCoreTranslations, hetArchiefClientTranslations, hetArchiefProxyTranslations, sqlFilePath, sql;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = process.argv[2];
                    if (app !== translations_core_types_1.App.AVO && app !== translations_core_types_1.App.HET_ARCHIEF) {
                        throw new Error('Translation script started with wrong "APP" parameter. Only valid values are: ["AVO", "HET_ARCHIEF"]');
                    }
                    if (!(app === translations_core_types_1.App.AVO)) return [3 /*break*/, 4];
                    // AVO admin-core
                    console.info('Migrate AVO admin-core translations...');
                    return [4 /*yield*/, migrateTranslations(path.resolve(__dirname, '../src/react-admin'), translations_core_types_1.App.AVO, translations_core_types_1.Component.ADMIN_CORE, '../shared/translations/avo/nl.json')];
                case 1:
                    avoAdminCoreTranslations = _a.sent();
                    // AVO client
                    console.info('Migrate AVO client translations...');
                    return [4 /*yield*/, migrateTranslations(path.resolve(__dirname, '../../../avo2-client/src'), translations_core_types_1.App.AVO, translations_core_types_1.Component.FRONTEND, 'shared/translations/nl.json')];
                case 2:
                    avoClientTranslations = _a.sent();
                    // AVO proxy
                    console.info('Migrate AVO admin-core translations...');
                    return [4 /*yield*/, migrateTranslations(path.resolve(__dirname, '../../../avo2-proxy/server/src'), translations_core_types_1.App.AVO, translations_core_types_1.Component.BACKEND, 'shared/translations/nl.json')];
                case 3:
                    avoProxyTranslations = _a.sent();
                    allTranslations = __spreadArray(__spreadArray(__spreadArray([], avoAdminCoreTranslations, true), avoClientTranslations, true), avoProxyTranslations, true);
                    return [3 /*break*/, 8];
                case 4:
                    // HetArchief admin-core
                    console.info('Migrate HET_ARCHIEF admin-core translations...');
                    return [4 /*yield*/, migrateTranslations(path.resolve(__dirname, '../src/react-admin'), translations_core_types_1.App.HET_ARCHIEF, translations_core_types_1.Component.ADMIN_CORE, '../shared/translations/hetArchief/nl.json')];
                case 5:
                    hetArchiefAdminCoreTranslations = _a.sent();
                    // HetArchief client
                    console.info('Migrate HET_ARCHIEF client translations...');
                    return [4 /*yield*/, migrateTranslations(path.resolve(__dirname, '../../../hetarchief-client/src'), translations_core_types_1.App.HET_ARCHIEF, translations_core_types_1.Component.FRONTEND, '../public/locales/nl/common.json')];
                case 6:
                    hetArchiefClientTranslations = _a.sent();
                    // HetArchief proxy
                    console.info('Migrate HET_ARCHIEF proxy translations...');
                    return [4 /*yield*/, migrateTranslations(path.resolve(__dirname, '../../../hetarchief-proxy/src'), translations_core_types_1.App.HET_ARCHIEF, translations_core_types_1.Component.BACKEND, 'shared/i18n/locales/nl.json')];
                case 7:
                    hetArchiefProxyTranslations = _a.sent();
                    allTranslations = __spreadArray(__spreadArray(__spreadArray([], hetArchiefAdminCoreTranslations, true), hetArchiefClientTranslations, true), hetArchiefProxyTranslations, true);
                    _a.label = 8;
                case 8:
                    sqlFilePath = path.resolve('./all-translations-' + (0, lodash_1.kebabCase)(app) + '.sql');
                    return [4 /*yield*/, fs.writeFile(sqlFilePath.replace('.sql', '.json'), JSON.stringify(allTranslations))];
                case 9:
                    _a.sent();
                    console.info('Writing SQL file: ' + sqlFilePath);
                    sql = allTranslations
                        .map(function (translationEntry) {
                        var component = "'".concat(translationEntry.component, "'");
                        var location = "'".concat(translationEntry.location, "'");
                        var key = "'".concat(translationEntry.key, "'");
                        var value = "'".concat(translationEntry.value.replace(/'/g, "''"), "'");
                        var value_type = "'".concat(translationEntry.value_type, "'");
                        var language = "'".concat(translationEntry.language, "'");
                        return "INSERT INTO app.translations (\"component\", \"location\", \"key\", \"value\", \"value_type\", \"language\") VALUES (".concat(component, ", ").concat(location, ", ").concat(key, ", ").concat(value, ", ").concat(value_type, ", ").concat(language, ") ON CONFLICT (component, location, key, language) DO UPDATE SET value = ").concat(value, ", value_type = ").concat(value_type, ";");
                    })
                        .sort()
                        .join('\n');
                    sql = 'TRUNCATE app.translations;\n' + sql;
                    return [4 /*yield*/, fs.writeFile(sqlFilePath, sql)];
                case 10:
                    _a.sent();
                    console.info('Finished writing ' + allTranslations.length + ' translations');
                    return [2 /*return*/];
            }
        });
    });
}
migrateAllTranslations().catch(function (err) {
    console.error('Migrate translations failed: ', err);
});
