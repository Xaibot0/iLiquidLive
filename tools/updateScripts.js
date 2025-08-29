const robotScript = `<meta name="robots" content="index, follow">`
const googleTagScript = `<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-QFTBYGXDCS"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-QFTBYGXDCS');
    </script>
    <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '703992442258884');
    fbq('track', 'PageView');
    </script>
    <noscript>
      <img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=703992442258884&ev=PageView&noscript=1"
      />
    </noscript>
    <!-- End Meta Pixel Code -->

    <!-- Event snippet for Page view conversion page -->
    <script>
      gtag('event', 'conversion', {
      'send_to': 'AW-17200254124/DspJCNi8ldoaEKyZ3IlA',
      'value': 1.0,
      'currency': 'USD'
      });
    </script>
    <!-- Event snippet for Purchase conversion page -->
    <script>
      gtag('event', 'conversion', {
      'send_to': 'AW-17200254124/sHhXCNSvw-caEKyZ3IlA',
      'transaction_id': ''
      });
    </script>`;

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(process.argv[2] || '.');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const dirent of list) {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (dirent.isFile() && fullPath.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

function insertTags(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const currencyScriptPattern = /(<script type="text\/javascript">window\.__WEBFLOW_CURRENCY_SETTINGS = \{[^]*?\};<\/script>)/;
  const metaGeneratorPattern = /(<meta content="Webflow" name="generator"\/>)/;

  let changed = false;

  // Insert <!-- google --> after the currency script tag
  if (currencyScriptPattern.test(content) && !content.includes(googleTagScript)) {
    content = content.replace(currencyScriptPattern, `   $1\n${googleTagScript}`);
    changed = true;
  }

  // Insert <meta name="robots" content="index, follow"> after the meta generator tag
  if (metaGeneratorPattern.test(content) && !content.includes(robotScript)) {
    content = content.replace(metaGeneratorPattern, `   $1\n${robotScript}`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    // console.log(content);
    console.log(`Updated tags in: ${filePath}`);
  }
}

const files = walk(rootDir);
files.forEach(insertTags);

console.log(`Processed ${files.length} .html files.`);
