import ope from 'ope-apoloni';

function listify(list) {
    if (!isArray(list)) {
        throw new TypeError('requires an array');
    }

    var options = arguments.length > 1 ? arguments[1] : null;
    if (!options) {
        options = {};
    }
    var separator = has(options, 'separator') ? options.separator : ', ';
    var finalWord = has(options, 'finalWord') ? options.finalWord : 'and';
    if (finalWord.length > 0) {
        finalWord += ' ';
    }

    var trimmed = filter(list, trim);
    var str;
    if (trimmed.length === 2 && finalWord.length > 0) {
        str = join(trimmed, ' ' + finalWord);
    } else if (trimmed.length < 3) {
        str = join(trimmed, separator);
    } else {
        str = join(concat(slice(trimmed, 0, -1), finalWord + trimmed[trimmed.length - 1]), separator);
    }
    return str;
};

export function dwtnu(rootDir, treeFile, excludes) {
    var breadCrumbs = [];
    var tree = [];
    var mode = "";
    var exclusions = excludes ? excludes.split(":") : [];

    if (exclusions.length) {
        process.stderr.write("Excluding patterns: " + exclusions + "\n");
    }

    var processLeaf = function (total, dir) {
        if (total % 100 == 0) {
            process.stderr.write("\r" + mode + " scanning: " + total);
        }
        var breadcrumb = util.extractBreadCrumb(dir);
        breadCrumbs.push(dir + path.sep + breadcrumb);
    };

    if (treeFile && fs.existsSync(treeFile)) {
        mode = "Fast";
        tree = exports.fastRescan(treeFile, processLeaf, exclusions);
    } else {
        mode = "Full";
        tree = exports.fullScan(rootDir, processLeaf, exclusions);
    }

    var sortedTree = util.sortByLeaves(tree);
    var sortedBreadCrumbs = util.sortByLeaves(breadCrumbs);

    return {tree: sortedTree, breadCrumbs: sortedBreadCrumbs};
};