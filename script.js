document.getElementById('checkButton').addEventListener('click', function() {
    const urlInput = document.getElementById('urlInput').value.trim();
    const resultDiv = document.getElementById('result');
    const checkButton = document.getElementById('checkButton');
    
    if (!urlInput) {
        resultDiv.innerHTML = '<div class="suspicious"><div class="icon"><i class="fas fa-exclamation-triangle"></i></div><div class="content"><h3>Error</h3><p>Please enter a URL.</p></div></div>';
        return;
    }
    
    const domain = extractDomain(urlInput);
    if (!domain) {
        resultDiv.innerHTML = '<div class="suspicious"><div class="icon"><i class="fas fa-exclamation-triangle"></i></div><div class="content"><h3>Error</h3><p>Invalid URL format.</p></div></div>';
        return;
    }
    
    // Show loading state
    resultDiv.innerHTML = '<div class="loading"><div class="icon"><i class="fas fa-spinner fa-spin"></i></div><div class="content"><h3>Checking...</h3><p>Please wait while we verify the URL.</p></div></div>';
    checkButton.disabled = true;
    checkButton.textContent = 'Checking...';
    
    const whitelist = {
        'bdo.com.ph': 'https://www.bdo.com.ph',
        'landbank.com': 'https://www.landbank.com',
        'bpi.com.ph': 'https://www.bpi.com.ph',
        'metrobank.com.ph': 'https://metrobank.com.ph',
        'chinabank.ph': 'https://www.chinabank.ph',
        'rcbc.com': 'https://www.rcbc.com',
        'securitybank.com': 'https://www.securitybank.com',
        'pnb.com.ph': 'https://www.pnb.com.ph',
        'dbp.ph': 'https://www.dbp.ph',
        'unionbankph.com': 'https://www.unionbankph.com',
        'eastwestbanker.com': 'https://www.eastwestbanker.com',
        'aub.com.ph': 'https://www.aub.com.ph',
        'pbcom.com.ph': 'https://www.pbcom.com.ph',
        'psbank.com.ph': 'https://www.psbank.com.ph',
        'robinsonsbank.com.ph': 'https://www.robinsonsbank.com.ph',
        'sterlingbankasia.com': 'https://www.sterlingbankasia.com',
        'ctbcbank.com.ph': 'https://www.ctbcbank.com.ph',
        'equicomsavings.com': 'https://equicomsavings.com',
        'fcb.com.ph': 'https://www.fcb.com.ph',
        'allbank.ph': 'https://www.allbank.ph',
        'brbi.ph': 'https://www.brbi.ph',
        'ruralbankguinobatan.com': 'https://www.ruralbankguinobatan.com',
        'maybank.com.ph': 'https://www.maybank.com.ph',
        'citibank.com.ph': 'https://www.citibank.com.ph',
        'hsbc.com.ph': 'https://www.hsbc.com.ph',
        'anz.com': 'https://www.anz.com',
        'bankcom.com.ph': 'https://www.bankcom.com.ph',
        'veteransbank.com.ph': 'https://www.veteransbank.com.ph',
        'mayabank.ph': 'https://www.mayabank.ph',
        'ofbank.gov.ph': 'https://www.ofbank.gov.ph',
        'tonikbank.com': 'https://www.tonikbank.com',
        'gotyme.com.ph': 'https://www.gotyme.com.ph',
        'uno.bank': 'https://www.uno.bank',
        'uniondigitalbank.io': 'https://www.uniondigitalbank.io',
        'gcash.com': 'https://new.gcash.com',
        'maya.ph': 'https://www.maya.ph',
        'grabpay.com': 'https://www.grabpay.com',
        'shopeepay.ph': 'https://shopeepay.ph',
        'coins.ph': 'https://www.coins.ph',
        'starpay.com.ph': 'https://starpay.com.ph',
        'tayocash.ph': 'https://tayocash.ph',
        'ussc.com.ph': 'https://www.ussc.com.ph',
        'zybitech.com': 'https://www.zybitech.com',
        'bayad.com': 'https://www.bayad.com'
    };
    
    // Simulate a delay for loading effect
    setTimeout(() => {
        let matchedDomain = null;
        for (let whitelistedDomain in whitelist) {
            if (domain === whitelistedDomain || domain.endsWith('.' + whitelistedDomain)) {
                matchedDomain = whitelistedDomain;
                break;
            }
        }
        if (matchedDomain) {
            resultDiv.innerHTML = '<div class="safe"><div class="icon"><i class="fas fa-shield-alt" style="color: #00ff88;"></i></div><div class="content"><h3>Safe</h3><p>This is the official URL. Official: <a href="' + whitelist[matchedDomain] + '" target="_blank">' + whitelist[matchedDomain] + '</a></p></div></div>';
        } else {
            const closestMatch = findClosestMatch(domain, Object.keys(whitelist));
            const smartSuggestion = findSmartSuggestion(domain, Object.keys(whitelist));
            let message = '<div class="suspicious"><div class="icon"><i class="fas fa-exclamation-triangle" style="color: #f5c6cb;"></i></div><div class="content"><h3>Warning: Suspicious URL</h3><p>This URL may not be legitimate. Always verify you\'re on the correct site.';
            if (smartSuggestion) {
                message += '<br>Did you mean: <a href="' + whitelist[smartSuggestion] + '" target="_blank">' + smartSuggestion + '</a>?';
            } else if (closestMatch) {
                message += '<br>Did you mean: <a href="' + whitelist[closestMatch] + '" target="_blank">' + closestMatch + '</a>?';
            }
            message += '<br><strong>Do not enter credentials or sensitive information on suspicious sites.</strong></p></div></div>';
            resultDiv.innerHTML = message;
        }
        checkButton.disabled = false;
        checkButton.textContent = 'Check URL';
    }, 1000);
});

function extractDomain(url) {
    try {
        const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
        let hostname = urlObj.hostname.toLowerCase();
        return hostname.startsWith('www.') ? hostname.substring(4) : hostname;
    } catch (e) {
        return null;
    }
}

function findClosestMatch(input, list) {
    let closest = null;
    let maxSimilarity = 0;
    const threshold = 0.8; // Adjust as needed
    for (let item of list) {
        const similarity = calculateSimilarity(input, item);
        if (similarity > maxSimilarity && similarity >= threshold) {
            maxSimilarity = similarity;
            closest = item;
        }
    }
    return closest;
}

function findSmartSuggestion(input, list) {
    // Check for partial matches or common phishing patterns
    for (let item of list) {
        if (item.includes(input) || input.includes(item.split('.')[0])) {
            return item;
        }
    }
    return null;
}

function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    if (longer.length === 0) return 1.0;
    return (longer.length - editDistance(longer, shorter)) / longer.length;
}

function editDistance(str1, str2) {
    const costs = new Array(str2.length + 1);
    for (let i = 0; i <= str1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= str2.length; j++) {
            if (i === 0) costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (str1.charAt(i - 1) !== str2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[str2.length] = lastValue;
    }
    return costs[str2.length];
}
