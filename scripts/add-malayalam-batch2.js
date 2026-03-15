// Malayalam translations for modules 5-10 (public-works-tourism through water-resources)
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'src', 'data', 'decade_records.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const translations = {
  "public-works-tourism": {
    1: { question_ml: "കേരളത്തിന്റെ ടൂറിസം വരുമാനം 2026-ൽ എത്ര?", options_ml: ["₹20,000 കോടി", "₹35,000 കോടി", "₹50,000+ കോടി", "₹15,000 കോടി"], flex_fact_ml: "ടൂറിസം GSDP-യുടെ 10%+ — കേരളം ഇന്ത്യയിലെ ഏറ്റവും ജനപ്രിയ ടൂറിസ്റ്റ് കേന്ദ്രം." },
    2: { question_ml: "Responsible Tourism Initiative-യുടെ ലക്ഷ്യം?", options_ml: ["ടൂറിസ്റ്റുകൾ കൂട്ടൽ മാത്രം", "പ്രാദേശിക സമൂഹങ്ങൾക്ക് പ്രയോജനം ഉറപ്പാക്കൽ", "ഹോട്ടൽ നിർമ്മാണം", "വിമാനത്താവളം പണിയൽ"], flex_fact_ml: "RT Mission — 500+ ഗ്രാമങ്ങളിൽ ടൂറിസം, തദ്ദേശ ഉൽപ്പന്നങ്ങൾക്ക് ₹300 കോടി+ വിൽപ്പന." },
    3: { question_ml: "കേരളത്തിൽ എത്ര കിലോമീറ്റർ ദേശീയ-സംസ്ഥാന പാതകൾ നവീകരിച്ചു?", options_ml: ["5,000 km", "10,000 km", "20,000+ km", "2,000 km"], flex_fact_ml: "KIIFB, NABARD ഫണ്ടിംഗിൽ റോഡ് ശൃംഖല വിപുലീകരിച്ചു — യാത്രാ സമയം 40% കുറഞ്ഞു." },
    4: { question_ml: "Caravan Tourism എന്ന പുതിയ ടൂറിസം മോഡൽ?", options_ml: ["ബസ് ടൂർ", "ചക്രവാഹനത്തിൽ യാത്ര ചെയ്ത് ടൂറിസം", "ബോട്ട് ടൂർ", "ട്രെയിൻ ടൂർ"], flex_fact_ml: "ഇന്ത്യയിൽ ആദ്യമായി Caravan Tourism നയം — 100+ caravan parks, വനമേഖലകളിലും കടൽത്തീരത്തും." },
    5: { question_ml: "Vyttila Mobility Hub എന്താണ്?", options_ml: ["വിമാനത്താവളം", "ഇന്റഗ്രേറ്റഡ് ട്രാൻസ്‌പോർട്ട് ഹബ്", "IT പാർക്ക്", "ഷോപ്പിംഗ് മാൾ"], flex_fact_ml: "ഇന്ത്യയിലെ ആദ്യ ഇന്റഗ്രേറ്റഡ് മൊബിലിറ്റി ഹബ് — ബസ്, മെട്രോ, വാട്ടർ ട്രാൻസ്‌പോർട്ട് ഒരിടത്ത്." },
    6: { question_ml: "കേരളത്തിന്റെ പാലം നിർമ്മാണ പദ്ധതിയിൽ എത്ര പാലങ്ങൾ പൂർത്തിയാക്കി?", options_ml: ["100", "300+", "500+", "50"], flex_fact_ml: "KIIFB വഴി 500+ പാലങ്ങൾ — ഗ്രാമീണ ബന്ധം ശക്തമാക്കി. സ്കൂൾ, ആശുപത്രി ലഭ്യത മെച്ചപ്പെട്ടു." },
    7: { question_ml: "Medical Tourism-ൽ കേരളത്തിന്റെ നേട്ടം?", options_ml: ["കുറഞ്ഞ നിലവാരം", "ഇന്ത്യയിലെ ഏറ്റവും മികച്ച Medical Tourism ലക്ഷ്യസ്ഥാനം", "Medical Tourism ഇല്ല", "ചെന്നൈയ്ക്ക് പിന്നിൽ"], flex_fact_ml: "വർഷം 5 ലക്ഷം+ വിദേശ രോഗികൾ — ആയുർവേദം + ആധുനിക ചികിത്സ." },
    8: { question_ml: "Hill Highway പദ്ധതി എന്താണ്?", options_ml: ["സമതല റോഡ്", "മലയോര ജില്ലകളെ ബന്ധിപ്പിക്കുന്ന 740 km ഹൈവേ", "കടൽത്തീര റോഡ്", "എക്സ്പ്രസ് വേ"], flex_fact_ml: "740 km Hill Highway — കാസർഗോഡ് മുതൽ തിരുവനന്തപുരം വരെ മലയോരം ചുറ്റി." },
    9: { question_ml: "കേരള ടൂറിസത്തിന്റെ 'God's Own Country' ബ്രാൻഡ് ഏത് വർഷം ആരംഭിച്ചു?", options_ml: ["1999", "2005", "2010", "2016"], flex_fact_ml: "ലോകത്തിലെ ഏറ്റവും വിജയകരമായ ടൂറിസം ബ്രാൻഡുകളിലൊന്ന് — 25+ വർഷം." },
    10: { question_ml: "Coastal Highway (Coastal Erosion Prevention)-ന്റെ നീളം?", options_ml: ["200 km", "350 km", "590+ km", "100 km"], flex_fact_ml: "590 km കടൽത്തീര ഹൈവേ — കടലാക്രമണ സംരക്ഷണവും ടൂറിസം വികസനവും." },
    11: { question_ml: "Backwater Tourism-ൽ ഹൗസ്‌ബോട്ടുകളുടെ എണ്ണം?", options_ml: ["200", "500", "900+", "100"], flex_fact_ml: "ആലപ്പുഴ — ലോകത്തിലെ ഏറ്റവും മനോഹരമായ ഉൾനാടൻ ജലയാത്ര ലക്ഷ്യസ്ഥാനം." },
    12: { question_ml: "KIIFB വഴി നിർമ്മിച്ച വലിയ പാലങ്ങളിൽ ഏതാണ് ശ്രദ്ധേയം?", options_ml: ["വൈപ്പിൻ പാലം", "കോഴിക്കോട് ബൈപാസ്", "ചെങ്ങന്നൂർ ബൈപാസ്", "തോട്ടപ്പള്ളി പാലം"], flex_fact_ml: "KIIFB — ₹50,000 കോടി+ അടിസ്ഥാന സൗകര്യ വികസനം. റോഡ്, പാലം, കെട്ടിടം എല്ലാം." },
    13: { question_ml: "Heritage Tourism-ൽ കേരളം എത്ര UNESCO സൈറ്റുകൾ?", options_ml: ["0", "1", "3", "5"], flex_fact_ml: "Western Ghats UNESCO World Heritage Site — ജൈവവൈവിധ്യത്തിന്റെ ആഗോള ഹോട്ട്‌സ്പോട്ട്." },
    14: { question_ml: "PWD (Public Works Department)-യുടെ e-Tender സംവിധാനം?", options_ml: ["ഓഫ്‌ലൈൻ ടെൻഡർ", "100% ഓൺലൈൻ e-Tendering — സുതാര്യത ഉറപ്പാക്കൽ", "ടെൻഡർ ഇല്ല", "മൗഖിക ടെൻഡർ"], flex_fact_ml: "100% e-Tendering — അഴിമതി കുറഞ്ഞു, സുതാര്യത വർധിച്ചു." },
    15: { question_ml: "Eco-Tourism-ൽ കേരളത്തിന്റെ സവിശേഷ മോഡൽ?", options_ml: ["വനം വെട്ടൽ", "സമൂഹ അടിസ്ഥാന ഇക്കോ-ടൂറിസം", "ഹോട്ടൽ നിർമ്മാണം വനത്തിൽ", "ടൂറിസം നിരോധനം"], flex_fact_ml: "Community-based Eco-Tourism — ആദിവാസി സമൂഹങ്ങൾ നേരിട്ട് വരുമാനം നേടുന്നു. 150+ ഇക്കോ-ടൂറിസം കേന്ദ്രങ്ങൾ." }
  },
  "higher-education-social-justice": {
    1: { question_ml: "കേരളത്തിലെ ഉന്നത വിദ്യാഭ്യാസ GER എത്ര?", options_ml: ["25%", "35%", "40%+", "20%"], flex_fact_ml: "ദേശീയ ശരാശരി 28% ആയിരിക്കെ കേരളം 40%+ — ഏറ്റവും ഉയർന്ന ഉന്നത വിദ്യാഭ്യാസ ചേരിക്കൽ." },
    2: { question_ml: "കേരളത്തിൽ എത്ര സർവകലാശാലകൾ?", options_ml: ["8", "12", "17+", "5"], flex_fact_ml: "17+ സർവകലാശാലകൾ — ഡിജിറ്റൽ ലൈബ്രറി, സ്മാർട്ട് ക്ലാസ്‌റൂം, ഓൺലൈൻ വിദ്യാഭ്യാസ സൗകര്യം." },
    3: { question_ml: "SC/ST വിദ്യാർത്ഥികൾക്കുള്ള Post-Matric Scholarship-ന്റെ കവറേജ്?", options_ml: ["ട്യൂഷൻ ഫീ മാത്രം", "ട്യൂഷൻ + ഹോസ്റ്റൽ + പുസ്തകം + ലാപ്ടോപ്", "₹1,000 പ്രതിമാസം", "ഫീസ് ഇളവ് മാത്രം"], flex_fact_ml: "ഇന്ത്യയിലെ ഏറ്റവും സമഗ്രമായ SC/ST സ്കോളർഷിപ്പ് — ലാപ്ടോപ്, കോച്ചിംഗ് ഉൾപ്പെടെ." },
    4: { question_ml: "സാമൂഹ്യ നീതി വകുപ്പിന്റെ Snehapoorvam പദ്ധതി?", options_ml: ["വയോജന പരിപാലനം", "അനാഥ/ഏകാംഗ കുടുംബ കുട്ടികൾക്ക് സ്കോളർഷിപ്പ്", "ഭവന നിർമ്മാണം", "വിവാഹ ധനസഹായം"], flex_fact_ml: "50,000+ കുട്ടികൾക്ക് പ്രതിമാസ ധനസഹായം — വിദ്യാഭ്യാസം ഉപേക്ഷിക്കാതിരിക്കാൻ." },
    5: { question_ml: "Transgender Policy ഉള്ള ഇന്ത്യയിലെ ആദ്യ സംസ്ഥാനം?", options_ml: ["തമിഴ്‌നാട്", "കേരളം", "മഹാരാഷ്ട്ര", "ദില്ലി"], flex_fact_ml: "2015-ൽ ട്രാൻസ്ജെൻഡർ പോളിസി — സർക്കാർ ജോലി, വിദ്യാഭ്യാസം, ആരോഗ്യം എല്ലാം ഉൾക്കൊള്ളിച്ചു." },
    6: { question_ml: "NAAC Accreditation ഉള്ള കേരള കോളേജുകളുടെ ശതമാനം?", options_ml: ["30%", "50%", "75%+", "20%"], flex_fact_ml: "ദേശീയ ശരാശരിയുടെ 3 മടങ്ങ് — ഗുണനിലവാര ഉറപ്പ് ഉന്നത വിദ്യാഭ്യാസത്തിൽ." },
    7: { question_ml: "വയോജന പരിപാലനത്തിൽ കേരളത്തിന്റെ മാതൃക?", options_ml: ["ഒരു പദ്ധതിയുമില്ല", "Vayomithram — 60+ വയസ്സുള്ളവർക്ക് സൗജന്യ ആരോഗ്യ-സാമൂഹ്യ സേവനം", "വൃദ്ധസദനം മാത്രം", "കേന്ദ്ര പദ്ധതി മാത്രം"], flex_fact_ml: "Vayomithram — 14 ജില്ലകളിലും. ഫോൺ ചെയ്താൽ വീട്ടിൽ ഡോക്ടർ, മരുന്ന്, കൗൺസിലിംഗ്." },
    8: { question_ml: "KSSM (Kerala Social Security Mission) എന്താണ്?", options_ml: ["IT കമ്പനി", "സാമൂഹ്യ സുരക്ഷാ പദ്ധതികൾ നടപ്പാക്കൽ ഏജൻസി", "ബാങ്ക്", "പോലീസ് സേന"], flex_fact_ml: "KSSM — വികലാംഗർ, വയോജനങ്ങൾ, മാനസിക രോഗികൾ — 5 ലക്ഷം+ ഗുണഭോക്താക്കൾ." },
    9: { question_ml: "Skill Development-ൽ ASAP (Additional Skill Acquisition Programme)?", options_ml: ["കൃഷി പരിശീലനം", "ഉന്നത വിദ്യാഭ്യാസത്തിനൊപ്പം സ്കിൽ ട്രെയിനിംഗ്", "ഓൺലൈൻ ഗെയിമിംഗ്", "ഡ്രൈവിംഗ് പരിശീലനം"], flex_fact_ml: "5 ലക്ഷം+ യുവാക്കൾക്ക് industry-ready skills — 200+ കോളേജുകളിൽ ASAP community skill parks." },
    10: { question_ml: "Women's Commission-ന്റെ ശക്തിപ്പെടുത്തൽ?", options_ml: ["നിർത്തലാക്കി", "Online complaint portal + Jagrata Samiti എല്ലാ പഞ്ചായത്തിലും", "പേരിന് മാത്രം", "കേന്ദ്ര കമ്മീഷനിൽ ലയിപ്പിച്ചു"], flex_fact_ml: "She-Box, One Stop Centre — 1000+ പഞ്ചായത്തുകളിൽ Jagrata Samiti. സ്ത്രീ സുരക്ഷ ശക്തമാക്കി." },
    11: { question_ml: "Research & Innovation-ൽ കേരള സർവകലാശാലകളുടെ NIRF റാങ്കിംഗ്?", options_ml: ["Top 100-ൽ ഒന്നുമില്ല", "Top 100-ൽ 5+ സർവകലാശാലകൾ", "അവസാന സ്ഥാനം", "റാങ്കിംഗ് ബാധകമല്ല"], flex_fact_ml: "CUSAT, Kerala University, Calicut University — NIRF Top 100-ൽ. ഗവേഷണ ഔട്ട്‌പുട്ട് 3 മടങ്ങ് വർധിച്ചു." },
    12: { question_ml: "ഭിന്നശേഷി വ്യക്തികൾക്കുള്ള Barrier-Free Kerala?", options_ml: ["ഒരു പദ്ധതിയുമില്ല", "എല്ലാ സർക്കാർ കെട്ടിടങ്ങളും Accessible", "ഭിന്നശേഷിക്കാരെ ഒഴിവാക്കി", "സ്വകാര്യ മേഖലയ്ക്ക് മാത്രം"], flex_fact_ml: "Barrier-Free Kerala — റാമ്പ്, ലിഫ്റ്റ്, ടോയ്‌ലറ്റ് — 5,000+ സർക്കാർ കെട്ടിടങ്ങൾ accessible." },
    13: { question_ml: "OBC/Minority സ്കോളർഷിപ്പ് വിതരണം?", options_ml: ["₹10 കോടി", "₹50 കോടി", "₹200 കോടി+", "₹5 കോടി"], flex_fact_ml: "OBC, Minority വിദ്യാർത്ഥികൾക്ക് ₹200 കോടി+ — വിദ്യാഭ്യാസ സമത്വം ഉറപ്പാക്കൽ." },
    14: { question_ml: "Anti-Ragging Cell-ന്റെ പ്രവർത്തനം?", options_ml: ["എല്ലാ കോളേജിലും 24/7 ഹെൽപ്‌ലൈൻ + CCTV", "ഒന്നുമില്ല", "വർഷത്തിൽ ഒരു മീറ്റിംഗ്", "പോലീസ് മാത്രം"], flex_fact_ml: "ഇന്ത്യയിൽ ഏറ്റവും കുറഞ്ഞ ragging incidents — സുരക്ഷിത കാമ്പസ് അന്തരീക്ഷം." },
    15: { question_ml: "Mental Health-ൽ കോളേജ് വിദ്യാർത്ഥികൾക്കുള്ള പദ്ധതി?", options_ml: ["ഒന്നുമില്ല", "എല്ലാ കോളേജിലും Counsellor + Student Wellness Centre", "മരുന്ന് വിതരണം", "ഓൺലൈൻ ക്ലാസ് മാത്രം"], flex_fact_ml: "ഇന്ത്യയിൽ ആദ്യമായി എല്ലാ സർക്കാർ കോളേജിലും Professional Counsellor — MHAT Act Implementation." }
  },
  "planning-economy": {
    1: { question_ml: "2026-ലെ കേരളത്തിന്റെ GSDP വളർച്ചാ നിരക്ക്?", options_ml: ["4%", "6%", "8%+", "3%"], flex_fact_ml: "ദേശീയ ശരാശരിയെക്കാൾ ഉയർന്ന വളർച്ച — സേവന മേഖല, remittance, IT അടിസ്ഥാനം." },
    2: { question_ml: "KIIFB (Kerala Infrastructure Investment Fund Board) എന്താണ്?", options_ml: ["ബാങ്ക്", "അടിസ്ഥാന സൗകര്യ ധനസഹായ സ്ഥാപനം", "IT കമ്പനി", "ടൂറിസം ബോർഡ്"], flex_fact_ml: "KIIFB — ₹50,000 കോടി+ അടിസ്ഥാന സൗകര്യ വികസനം. masala bonds, green bonds വഴി ധനസമാഹരണം." },
    3: { question_ml: "SDG (Sustainable Development Goals) നേട്ടത്തിൽ കേരളത്തിന്റെ NITI Aayog index?", options_ml: ["ആദ്യ 5-ൽ", "ആദ്യ 3-ൽ", "ഒന്നാം സ്ഥാനം", "പത്താം സ്ഥാനം"], flex_fact_ml: "NITI Aayog SDG Index-ൽ ഒന്നാം സ്ഥാനം — 17 ലക്ഷ്യങ്ങളിലും മികച്ച പ്രകടനം." },
    4: { question_ml: "Per Capita Income-ൽ കേരളം ഇന്ത്യയിൽ?", options_ml: ["ഏറ്റവും കുറവ്", "ശരാശരി", "ഏറ്റവും ഉയർന്ന സംസ്ഥാനങ്ങളിൽ ഒന്ന്", "പത്താം സ്ഥാനം"], flex_fact_ml: "Per Capita Income ₹2.5 ലക്ഷം+ — ദേശീയ ശരാശരിയുടെ ഇരട്ടിയിലധികം." },
    5: { question_ml: "Kerala State Planning Board-ന്റെ കാഴ്ചപ്പാട് രേഖ?", options_ml: ["Kerala 2020", "Kerala 2030", "Nava Keralam", "Smart Kerala"], flex_fact_ml: "Nava Keralam — അറിവ് സമ്പദ്‌വ്യവസ്ഥ, ഹരിത വികസനം, സാമൂഹ്യ നീതി — മൂന്ന് തൂണുകൾ." },
    6: { question_ml: "Pravasi Welfare Board-ന്റെ ലക്ഷ്യം?", options_ml: ["വിദേശ യാത്ര സൗകര്യം", "പ്രവാസി കേരളീയരുടെ ക്ഷേമം — ഇൻഷുറൻസ്, പെൻഷൻ", "വിദേശ നയം", "കുടിയേറ്റ നിയന്ത്രണം"], flex_fact_ml: "35 ലക്ഷം+ പ്രവാസി അംഗങ്ങൾ — NORKA-ROOTS വഴി പുനരധിവാസം, ധനസഹായം." },
    7: { question_ml: "Kerala Knowledge Economy Mission-ന്റെ ശ്രദ്ധ?", options_ml: ["കൃഷി", "AI, Data Science, Deep Tech — ഉന്നത skill development", "ടൂറിസം", "വ്യവസായം"], flex_fact_ml: "5 ലക്ഷം യുവാക്കൾക്ക് AI/Data Science training — ₹1,000 കോടി Knowledge Economy Mission." },
    8: { question_ml: "HDI (Human Development Index)-ൽ കേരളം ഇന്ത്യയിൽ?", options_ml: ["മൂന്നാം സ്ഥാനം", "രണ്ടാം സ്ഥാനം", "ഒന്നാം സ്ഥാനം", "അഞ്ചാം സ്ഥാനം"], flex_fact_ml: "1990 മുതൽ ഒന്നാം സ്ഥാനം — ആരോഗ്യം, വിദ്യാഭ്യാസം, വരുമാനം — മൂന്നിലും മുന്നിൽ." },
    9: { question_ml: "Local Self-Government Plan Allocation ശതമാനം?", options_ml: ["10%", "20%", "30%+", "5%"], flex_fact_ml: "30%+ plan outlay — ഇന്ത്യയിൽ ഏറ്റവും ഉയർന്ന വികേന്ദ്രീകരണം." },
    10: { question_ml: "Kerala Infrastructure Fund Management-ന്റെ Masala Bond?", options_ml: ["₹500 കോടി", "₹1,000 കോടി", "₹2,150+ കോടി", "₹100 കോടി"], flex_fact_ml: "ഇന്ത്യയിൽ ആദ്യ State-level Masala Bond — London Stock Exchange-ൽ ലിസ്റ്റ് ചെയ്തു." },
    11: { question_ml: "കേരളത്തിന്റെ Poverty Rate ദേശീയ ശരാശരിയുമായി?", options_ml: ["ദേശീയ ശരാശരിക്ക് മുകളിൽ", "ദേശീയ ശരാശരിക്ക് തുല്യം", "ദേശീയ ശരാശരിയുടെ പകുതിയിൽ താഴെ", "ഏറ്റവും ഉയർന്നത്"], flex_fact_ml: "0.7% extreme poverty — ദേശീയ ശരാശരി 5%+. ഇന്ത്യയിലെ ഏറ്റവും കുറഞ്ഞ ദാരിദ്ര്യം." },
    12: { question_ml: "Gender Budget-ൽ കേരളം?", options_ml: ["Gender Budget ഇല്ല", "ബജറ്റിന്റെ 15%+", "ബജറ്റിന്റെ 5%", "കേന്ദ്ര അനുപാതം മാത്രം"], flex_fact_ml: "ഇന്ത്യയിൽ ഏറ്റവും ഉയർന്ന Gender Budget — സ്ത്രീ ശാക്തീകരണത്തിന് ₹15,000 കോടി+." },
    13: { question_ml: "Rebuild Kerala Initiative (RKI) എന്ന ദുരന്തശേഷ പുനർനിർമ്മാണ പദ്ധതി?", options_ml: ["₹5,000 കോടി", "₹10,000 കോടി", "₹30,000 കോടി+", "₹1,000 കോടി"], flex_fact_ml: "World Bank, ADB സഹായത്തോടെ — resilient infrastructure, ജല സംരക്ഷണം, കാലാവസ്ഥാ അനുകൂലനം." },
    14: { question_ml: "Gini Coefficient (അസമത്വ സൂചിക)-ൽ കേരളം?", options_ml: ["ഏറ്റവും ഉയർന്ന അസമത്വം", "ശരാശരി", "ഇന്ത്യയിലെ ഏറ്റവും കുറഞ്ഞ അസമത്വം", "ഡാറ്റ ലഭ്യമല്ല"], flex_fact_ml: "ഇന്ത്യയിലെ ഏറ്റവും തുല്യ സമൂഹം — Gini Coefficient 0.31 (ദേശീയ 0.35+)." },
    15: { question_ml: "കേരള സമ്പദ്‌വ്യവസ്ഥയിലെ Service Sector-ന്റെ പങ്ക്?", options_ml: ["30%", "45%", "65%+", "20%"], flex_fact_ml: "65%+ GSDP — IT, ടൂറിസം, ആരോഗ്യം, വിദ്യാഭ്യാസം. സേവന മേഖലാ അധിഷ്ഠിത സമ്പദ്‌വ്യവസ്ഥ." }
  },
  "revenue-housing": {
    1: { question_ml: "Smart Village Office-കളുടെ എണ്ണം?", options_ml: ["100", "300", "500+", "50"], flex_fact_ml: "ഡിജിറ്റൈസ്ഡ് Village Offices — ജനങ്ങൾക്ക് 30+ സേവനങ്ങൾ ഒരു കുടക്കീഴിൽ." },
    2: { question_ml: "Revenue Recovery-യിൽ ഡിജിറ്റൈസേഷന്റെ ഫലം?", options_ml: ["മാറ്റമില്ല", "നികുതി പിരിവ് 40% മെച്ചപ്പെട്ടു", "നികുതി റദ്ദാക്കി", "പിരിവ് കുറഞ്ഞു"], flex_fact_ml: "ഡിജിറ്റൽ നികുതി പിരിവ് — സുതാര്യത, വേഗത. ₹5,000 കോടി+ അധിക വരുമാനം." },
    3: { question_ml: "LIFE Mission ഫ്ലാറ്റ് പദ്ധതിയിൽ എത്ര ഫ്ലാറ്റുകൾ?", options_ml: ["5,000", "10,000", "15,000+", "2,000"], flex_fact_ml: "ഭൂരഹിതർക്ക് ഫ്ലാറ്റ് — 4 നിലകൾ, ലിഫ്റ്റ്, community hall. നഗരങ്ങളിൽ അന്തസ്സുള്ള പാർപ്പിടം." },
    4: { question_ml: "RR (Revenue Recovery) IT System-ന്റെ പേര്?", options_ml: ["e-Revenue", "SUGAMA", "ReLIS", "DigiTax"], flex_fact_ml: "ReLIS (Revenue Land Information System) — ഭൂമി രേഖകൾ ഡിജിറ്റൈസ്, thandaper online." },
    5: { question_ml: "ദുരന്ത നിവാരണ ഫണ്ട് വിതരണ സമയം?", options_ml: ["6 മാസം", "3 മാസം", "72 മണിക്കൂർ", "1 വർഷം"], flex_fact_ml: "72 മണിക്കൂറിൽ ദുരിതാശ്വാസം — DBT വഴി ബാങ്ക് അക്കൗണ്ടിൽ നേരിട്ട്." },
    6: { question_ml: "ഭൂമി രജിസ്ട്രേഷൻ ഓൺലൈൻ ആക്കിയ സംവിധാനം?", options_ml: ["PEARL", "e-Registration", "RILIS", "DigiLand"], flex_fact_ml: "PEARL — 100% ഓൺലൈൻ ഭൂമി രജിസ്ട്രേഷൻ. കാത്തിരിപ്പ് സമയം 80% കുറഞ്ഞു." },
    7: { question_ml: "Disaster Management-ൽ KSDMA-യുടെ പങ്ക്?", options_ml: ["ഒരു പങ്കുമില്ല", "സമഗ്ര ദുരന്ത മുൻകരുതൽ, പ്രതികരണം, പുനർനിർമ്മാണം", "പ്രളയ കണക്കെടുപ്പ് മാത്രം", "കേന്ദ്രത്തിന് റിപ്പോർട്ട് ചെയ്യൽ"], flex_fact_ml: "KSDMA — 2018, 2019, 2021 പ്രളയങ്ങളിൽ ലോകോത്തര ദുരന്ത പ്രതികരണ മാതൃക." },
    8: { question_ml: "Housing Loan Subsidy — PMAY + LIFE?", options_ml: ["₹1 ലക്ഷം", "₹2.5 ലക്ഷം", "₹4 ലക്ഷം+", "₹50,000"], flex_fact_ml: "PMAY + LIFE = ₹4 ലക്ഷം+ subsidy. ദരിദ്ര കുടുംബങ്ങൾക്ക് സ്വന്തം വീട് യാഥാർഥ്യം." },
    9: { question_ml: "Survey & Land Records Modernization?", options_ml: ["പഴയ രീതി തുടരുന്നു", "ഡ്രോൺ survey + digital mapping", "Survey നിർത്തി", "GPS മാത്രം"], flex_fact_ml: "ഡ്രോൺ survey — 1 കോടി+ ഭൂമി രേഖകൾ ഡിജിറ്റൈസ്. തർക്കങ്ങൾ 50% കുറഞ്ഞു." },
    10: { question_ml: "Revenue Department-ന്റെ സേവന ചരിത്രം?", options_ml: ["ഒരു നൂറ്റാണ്ട്", "175+ വർഷം", "50 വർഷം", "200+ വർഷം"], flex_fact_ml: "ബ്രിട്ടീഷ് കാലം മുതലുള്ള Revenue Administration — ഇപ്പോൾ പൂർണ ഡിജിറ്റൽ." },
    11: { question_ml: "Rehabilitation-ൽ Kerala Model?", options_ml: ["പുനരധിവാസം ഇല്ല", "Owner-driven reconstruction — ഗുണഭോക്താവ് തന്നെ വീട് നിർമ്മിക്കുന്നു", "Contractor-driven", "Temporary shelter മാത്രം"], flex_fact_ml: "Owner-driven — ഗുണഭോക്താവിന്റെ ഇഷ്ടാനുസരണം വീട് ഡിസൈൻ. LIFE Mission-ന്റെ മാതൃക." },
    12: { question_ml: "Flood Mapping, Early Warning System?", options_ml: ["ലഭ്യമല്ല", "KSDMA + ISRO + IMD — AI-based Early Warning", "Manual observation", "Radio announcement"], flex_fact_ml: "AI + IoT based flood early warning — 48 മണിക്കൂർ മുൻകൂർ അറിയിപ്പ്. ജീവൻ രക്ഷിച്ചു." },
    13: { question_ml: "e-Certificate — ഓൺലൈൻ സർട്ടിഫിക്കറ്റ് സേവനം?", options_ml: ["5 സർട്ടിഫിക്കറ്റുകൾ", "10 സർട്ടിഫിക്കറ്റുകൾ", "30+ സർട്ടിഫിക്കറ്റുകൾ ഓൺലൈനിൽ", "ഓൺലൈൻ ഇല്ല"], flex_fact_ml: "ജാതി, വരുമാനം, നേറ്റിവിറ്റി — 30+ സർട്ടിഫിക്കറ്റുകൾ ഓൺലൈനിൽ. ഓഫീസിൽ പോകേണ്ട." },
    14: { question_ml: "Housing for Endosulfan Victims?", options_ml: ["ഒരു പദ്ധതിയുമില്ല", "1,500+ വീടുകൾ + ചികിത്സ + പെൻഷൻ", "₹10,000 നഷ്ടപരിഹാരം", "ഒഴിപ്പിച്ചു"], flex_fact_ml: "Endosulfan ഇരകൾക്ക് സമഗ്ര പരിചരണം — വീട്, ആരോഗ്യം, പെൻഷൻ, വിദ്യാഭ്യാസം." },
    15: { question_ml: "Land Tribunal-ന്റെ ഡിജിറ്റൽ പരിഷ്കരണം?", options_ml: ["മാറ്റമില്ല", "ഓൺലൈൻ ഫയലിംഗ് + virtual hearing", "Tribunal പൂട്ടി", "കൈയെഴുത്ത് മാത്രം"], flex_fact_ml: "ഓൺലൈൻ Land Tribunal — കേസ് ഫയലിംഗ്, ട്രാക്കിംഗ്, hearing. നീതി വേഗത്തിൽ." }
  },
  "forest-wildlife": {
    1: { question_ml: "കേരളത്തിലെ വനവിസ്തൃതി ശതമാനം?", options_ml: ["20%", "25%", "29%+", "15%"], flex_fact_ml: "29%+ ഭൂവിസ്തൃതി — ദേശീയ ശരാശരി 21%. Western Ghats ജൈവവൈവിധ്യ ഹോട്ട്‌സ്പോട്ട്." },
    2: { question_ml: "പുലി സംരക്ഷണത്തിൽ Periyar Tiger Reserve-ന്റെ സ്ഥാനം?", options_ml: ["ഇന്ത്യയിലെ ഏറ്റവും മികച്ചതിൽ ഒന്ന്", "ശരാശരി", "മോശം", "Tiger Reserve അല്ല"], flex_fact_ml: "Periyar — 50+ പുലികൾ. Community-based eco-tourism model — ആദിവാസി guide-മാർ." },
    3: { question_ml: "ഏഷ്യൻ ആനകളുടെ ജനസംഖ്യ കേരളത്തിൽ?", options_ml: ["1,000", "3,500", "5,700+", "500"], flex_fact_ml: "ഇന്ത്യയിലെ ഏറ്റവും കൂടുതൽ ആനകളുള്ള സംസ്ഥാനങ്ങളിൽ ഒന്ന് — ആന-മനുഷ്യ സംഘർഷം നിയന്ത്രിക്കൽ." },
    4: { question_ml: "ജൈവവൈവിധ്യ രജിസ്ട്രേഷൻ — People's Biodiversity Register?", options_ml: ["100 പഞ്ചായത്തിൽ", "500 പഞ്ചായത്തിൽ", "എല്ലാ 1,000+ പഞ്ചായത്തിലും", "ഒരു പഞ്ചായത്തിലും ഇല്ല"], flex_fact_ml: "ഇന്ത്യയിൽ ആദ്യം 100% People's Biodiversity Register — പ്രാദേശിക ജൈവവൈവിധ്യം രേഖപ്പെടുത്തി." },
    5: { question_ml: "Wayanad Wildlife Sanctuary-യിലെ ആന ഇടനാഴി (Elephant Corridor)?", options_ml: ["ഒന്നുമില്ല", "Bandipur-Mudumalai-Wayanad ത്രികോണ ഇടനാഴി", "Road widening", "ഒഴിപ്പിക്കൽ"], flex_fact_ml: "ദക്ഷിണ ഇന്ത്യയിലെ ഏറ്റവും വലിയ ആന ഇടനാഴി — 3 സംസ്ഥാനങ്ങൾ ചേർന്ന സംരക്ഷണ മാതൃക." },
    6: { question_ml: "Mangrove Restoration-ൽ കേരളം?", options_ml: ["ഒരു പ്രവർത്തനവുമില്ല", "500+ ഹെക്ടർ mangrove വനം പുനഃസ്ഥാപിച്ചു", "Mangrove വെട്ടി", "10 ഹെക്ടർ മാത്രം"], flex_fact_ml: "Kannur, Ernakulam — കണ്ടൽക്കാട് സംരക്ഷണം. തീരദേശ ക്ഷയം + കാലാവസ്ഥാ അനുകൂലനം." },
    7: { question_ml: "വന അവകാശ നിയമം (FRA) നടപ്പാക്കലിൽ കേരളം?", options_ml: ["നടപ്പാക്കിയില്ല", "ആദിവാസി ഭൂമി അവകാശം 10,000+ കുടുംബങ്ങൾക്ക്", "നിരസിച്ചു", "100 കുടുംബങ്ങൾക്ക് മാത്രം"], flex_fact_ml: "FRA — ആദിവാസി ഭൂമി ഉടമസ്ഥത + സാമൂഹ്യ വനാവകാശം. അതിജീവന മാർഗം ഉറപ്പാക്കി." },
    8: { question_ml: "Silent Valley National Park-ന്റെ പ്രത്യേകത?", options_ml: ["ബീച്ച് ടൂറിസം", "ഇന്ത്യയിലെ അവസാന tropical evergreen വനം", "Tiger Reserve", "ഡാം നിർമ്മിച്ചു"], flex_fact_ml: "1980-ലെ ജനകീയ പ്രക്ഷോഭം ഡാം തടഞ്ഞു — ഇന്ത്യൻ പരിസ്ഥിതി പ്രസ്ഥാനത്തിന്റെ തുടക്കം." },
    9: { question_ml: "Western Ghats Ecology Expert Panel (Gadgil Committee)?", options_ml: ["പൂർണമായി നടപ്പാക്കി", "ഭാഗികമായി നടപ്പാക്കി — ESZ rules", "നിരസിച്ചു", "പഠനം മാത്രം"], flex_fact_ml: "ESZ (Ecologically Sensitive Zone) — വികസനവും പരിസ്ഥിതിയും സന്തുലിതമാക്കൽ." },
    10: { question_ml: "വന്യജീവി ചികിത്സ — Wildlife Rehabilitation Centre?", options_ml: ["ഒന്നുമില്ല", "Thrissur, Wayanad, Idukki-ൽ 3+ കേന്ദ്രങ്ങൾ", "1 കേന്ദ്രം", "Private hospital-ൽ"], flex_fact_ml: "മുറിവേറ്റ ആനകൾ, പുലികൾ, മറ്റ് വന്യജീവികൾ — 24/7 ചികിത്സ + പുനരധിവാസം." },
    11: { question_ml: "Sandalwood Plantation-ൽ കേരളം?", options_ml: ["Sandalwood ഇല്ല", "Marayoor-ൽ ഇന്ത്യയിലെ ഏക natural sandalwood forest", "imported", "Karnataka-ൽ നിന്ന്"], flex_fact_ml: "Marayoor — 92 sq km natural sandalwood — ലോകത്തിലെ ഏറ്റവും ഗുണമേന്മയുള്ള ചന്ദനം." },
    12: { question_ml: "Parambikulam Tiger Reserve-ന്റെ TX2 Award?", options_ml: ["ടൂറിസം Award", "Tiger Conservation Excellence Award — ആഗോളതലം", "State Award", "ഒരു award-ഉം ഇല്ല"], flex_fact_ml: "TX2 Award — ലോകത്തിലെ മികച്ച 5 Tiger Reserve-കളിൽ ഒന്ന്." },
    13: { question_ml: "Social Forestry-ൽ കേരളം?", options_ml: ["ഒരു പ്രോഗ്രാമും ഇല്ല", "10 കോടി+ മരങ്ങൾ നട്ടു — Pacha Thonikal", "5 ലക്ഷം മരം", "വനം വെട്ടി"], flex_fact_ml: "Pacha Thonikal — 10 കോടി+ മരങ്ങൾ. ഓരോ ജനനത്തിനും ഒരു മരം." },
    14: { question_ml: "Fire Prevention-ൽ Forest Department?", options_ml: ["ഒരു നടപടിയുമില്ല", "Fire Line, Watchtower, drone monitoring", "അഗ്നിശമന സേനയ്ക്ക് കൈമാറി", "Insurance മാത്രം"], flex_fact_ml: "Drone + Satellite monitoring — വനാഗ്നി 60% കുറഞ്ഞു. 1,000+ watchtower-കൾ." },
    15: { question_ml: "Eco-Sensitive Zone-കളുടെ എണ്ണം?", options_ml: ["5", "10", "23+", "2"], flex_fact_ml: "23+ ESZ — വികസനം നിയന്ത്രിച്ച് പരിസ്ഥിതി സംരക്ഷണം. Western Ghats buffer zone." }
  },
  "finance": {
    1: { question_ml: "കേരളത്തിന്റെ 2026 ബജറ്റ് വലുപ്പം?", options_ml: ["₹1 ലക്ഷം കോടി", "₹1.5 ലക്ഷം കോടി", "₹2 ലക്ഷം കോടി+", "₹50,000 കോടി"], flex_fact_ml: "2016-ലെ ₹1 ലക്ഷം കോടിയിൽ നിന്ന് ഇരട്ടി — ക്ഷേമം + വികസനം + അടിസ്ഥാന സൗകര്യം." },
    2: { question_ml: "GST നടപ്പാക്കലിൽ കേരളത്തിന്റെ സ്ഥാനം?", options_ml: ["മോശം", "ശരാശരി", "ഏറ്റവും മികച്ച compliance rate-ഉള്ള സംസ്ഥാനങ്ങളിൽ ഒന്ന്", "GST എതിർത്തു"], flex_fact_ml: "GST compliance 95%+ — ഡിജിറ്റൽ invoicing, return filing-ൽ മുന്നിൽ." },
    3: { question_ml: "Kerala State Financial Enterprises (KSFE)-യുടെ chit fund AUM?", options_ml: ["₹10,000 കോടി", "₹25,000 കോടി", "₹50,000 കോടി+", "₹5,000 കോടി"], flex_fact_ml: "ലോകത്തിലെ ഏറ്റവും വലിയ സർക്കാർ chit fund — 50 ലക്ഷം+ subscribers." },
    4: { question_ml: "Social Security Pension — മാസ വിതരണം?", options_ml: ["₹500", "₹1,000", "₹1,600+", "₹300"], flex_fact_ml: "55 ലക്ഷം+ ഗുണഭോക്താക്കൾ — ₹1,600/month. ഇന്ത്യയിൽ ഏറ്റവും ഉയർന്ന സംസ്ഥാന പെൻഷൻ." },
    5: { question_ml: "Own Tax Revenue-ന്റെ Growth Rate?", options_ml: ["5%", "8%", "12%+", "3%"], flex_fact_ml: "GST + Excise + Stamp Duty — 12%+ CAGR. ഡിജിറ്റൈസേഷൻ, compliance improvement." },
    6: { question_ml: "Kerala Tax-ൽ e-Filing ശതമാനം?", options_ml: ["50%", "70%", "95%+", "30%"], flex_fact_ml: "95%+ e-Filing — K-SWIFT, e-Payment, online return. ഓഫീസിൽ പോകേണ്ട." },
    7: { question_ml: "Welfare Pension ഗുണഭോക്താക്കൾ — ആകെ എണ്ണം?", options_ml: ["20 ലക്ഷം", "35 ലക്ഷം", "55 ലക്ഷം+", "10 ലക്ഷം"], flex_fact_ml: "ഇന്ത്യയിൽ ജനസംഖ്യാ അനുപാതത്തിൽ ഏറ്റവും കൂടുതൽ pension ഗുണഭോക്താക്കൾ." },
    8: { question_ml: "KIIFB-യുടെ ആകെ project investment?", options_ml: ["₹10,000 കോടി", "₹25,000 കോടി", "₹50,000 കോടി+", "₹5,000 കോടി"], flex_fact_ml: "900+ projects — റോഡ്, പാലം, ആശുപത്രി, സ്കൂൾ. സംസ്ഥാന ചരിത്രത്തിലെ ഏറ്റവും വലിയ infra push." },
    9: { question_ml: "Lottery Revenue-യുടെ സാമൂഹ്യ ക്ഷേമ സംഭാവന?", options_ml: ["₹500 കോടി", "₹1,000 കോടി", "₹10,000+ കോടി/വർഷം", "₹100 കോടി"], flex_fact_ml: "Lottery revenue — ആരോഗ്യം, വിദ്യാഭ്യാസ ക്ഷേമ പദ്ധതികൾക്ക്. ₹10,000+ കോടി/വർഷം." },
    10: { question_ml: "DBT (Direct Benefit Transfer) വഴി scholarship/pension?", options_ml: ["10%", "50%", "90%+", "25%"], flex_fact_ml: "90%+ DBT — ബാങ്ക് അക്കൗണ്ടിൽ നേരിട്ട്. ഇടനിലക്കാരെ ഒഴിവാക്കി." },
    11: { question_ml: "Fiscal Deficit GSDP ശതമാനം?", options_ml: ["5%+", "4%", "3% താഴെ", "6%"], flex_fact_ml: "FRBM ചട്ടക്കൂടിനുള്ളിൽ — ഉത്തരവാദിത്ത ധനകാര്യ മാനേജ്‌മെന്റ്." },
    12: { question_ml: "Green Bond — Kerala-ന്റെ ആഗോള bond issue?", options_ml: ["ഒന്നുമില്ല", "KIIFB Green + Masala Bond — London Stock Exchange", "US Bond", "yen bond"], flex_fact_ml: "ഇന്ത്യൻ സംസ്ഥാനങ്ങളിൽ ആദ്യ international bond — ₹2,150 കോടി." },
    13: { question_ml: "കേരളത്തിന്റെ Total Tax Buoyancy?", options_ml: ["0.5", "0.8", "1.2+", "0.3"], flex_fact_ml: "Tax buoyancy 1.2+ — GSDP വളരുന്നതിനേക്കാൾ വേഗത്തിൽ tax revenue വളരുന്നു." },
    14: { question_ml: "IT Department-ന്റെ Faceless Assessment?", options_ml: ["ഒന്നുമില്ല", "AI-based risk assessment + online verification", "Manual audit", "Random check"], flex_fact_ml: "Faceless assessment — corruption കുറഞ്ഞു, compliance speed 3x." },
    15: { question_ml: "Revenue Mobilization-ൽ Stamp Duty ഡിജിറ്റൈസേഷൻ?", options_ml: ["ഓഫ്‌ലൈൻ", "e-Stamp + online payment — 100% digital", "Semi-digital", "Paper stamp മാത്രം"], flex_fact_ml: "e-Stamp — fraud 90%+ കുറഞ്ഞു. ₹3,000 കോടി+ stamp duty collection." }
  },
  "water-resources": {
    1: { question_ml: "Jal Jeevan Mission-ൽ കേരളത്തിന്റെ tap water coverage?", options_ml: ["50%", "70%", "90%+", "30%"], flex_fact_ml: "ഇന്ത്യയിൽ ഏറ്റവും വേഗത്തിൽ 100% tap water ലക്ഷ്യം നേടുന്ന സംസ്ഥാനങ്ങളിൽ ഒന്ന്." },
    2: { question_ml: "Haritha Keralam Mission-ൽ എത്ര ജലസ്രോതസ്സുകൾ പുനരുജ്ജീവിപ്പിച്ചു?", options_ml: ["1,000", "5,000", "10,000+", "500"], flex_fact_ml: "10,000+ കുളങ്ങൾ, തോടുകൾ — ജലസംരക്ഷണം + ജലനിരപ്പ് ഉയർത്തൽ." },
    3: { question_ml: "KINFRA Water Infrastructure Park?", options_ml: ["Textile park", "Water treatment, testing, R&D hub", "IT park", "Food park"], flex_fact_ml: "ജല ശുദ്ധീകരണ സാങ്കേതിക വിദ്യ R&D — ഇന്ത്യയിൽ ആദ്യത്തേത്." },
    4: { question_ml: "Kerala Water Authority-യുടെ 24/7 water supply?", options_ml: ["1 നഗരം", "3 നഗരങ്ങൾ", "10+ നഗരങ്ങൾ", "ഒരു നഗരവുമില്ല"], flex_fact_ml: "10+ നഗരങ്ങൾ — 24/7 ജലവിതരണം. Smart metering + leak detection." },
    5: { question_ml: "Flood Control — കേരളത്തിന്റെ Dam Safety?", options_ml: ["മാറ്റമില്ല", "Rule Curve revised + Dam Safety Authority", "ഡാം പൂട്ടി", "കേന്ദ്രത്തിന് കൈമാറി"], flex_fact_ml: "2018 പ്രളയത്തിന് ശേഷം 60+ ഡാമുകളുടെ rule curve revised — ശാസ്ത്രീയ ജല മാനേജ്‌മെന്റ്." },
    6: { question_ml: "Rain Water Harvesting — സർക്കാർ കെട്ടിടങ്ങളിൽ?", options_ml: ["10% കെട്ടിടങ്ങളിൽ", "50%", "നിർബന്ധമാക്കി — 100% പുതിയ കെട്ടിടങ്ങൾ", "ഒന്നിലും ഇല്ല"], flex_fact_ml: "Kerala Municipality Building Rules — എല്ലാ പുതിയ കെട്ടിടങ്ങൾക്കും rain water harvesting നിർബന്ധം." },
    7: { question_ml: "Irrigation coverage — ആകെ irrigated area?", options_ml: ["5 ലക്ഷം ഹെക്ടർ", "10 ലക്ഷം ഹെക്ടർ", "18+ ലക്ഷം ഹെക്ടർ", "3 ലക്ഷം ഹെക്ടർ"], flex_fact_ml: "Micro-irrigation, drip irrigation — ജലക്ഷമത 40% വർധിച്ചു. സ്മാർട്ട് ജലസേചനം." },
    8: { question_ml: "River Rejuvenation — എത്ര നദികളെ പുനരുജ്ജീവിപ്പിച്ചു?", options_ml: ["5", "10", "44 എല്ലാ നദികളും", "2"], flex_fact_ml: "44 നദികളും — മാലിന്യ നിർമ്മാർജ്ജനം + തീര സംരക്ഷണം + ജൈവവൈവിധ്യ പുനഃസ്ഥാപനം." },
    9: { question_ml: "Smart Water Metering?", options_ml: ["ഒന്നുമില്ല", "IoT-based smart meters — 5 ലക്ഷം+", "Manual reading", "Annual billing"], flex_fact_ml: "Smart metering — ജല നഷ്ടം (NRW) 30% കുറഞ്ഞു. Real-time monitoring." },
    10: { question_ml: "Drinking Water Quality Testing?", options_ml: ["ടെസ്റ്റ് ചെയ്യുന്നില്ല", "എല്ലാ പഞ്ചായത്തിലും FHTC + lab testing", "ജില്ലാ ലാബ് മാത്രം", "വർഷത്തിൽ ഒരിക്കൽ"], flex_fact_ml: "FHTC (Functional Household Tap Connection) — real-time water quality dashboard." },
    11: { question_ml: "Coastal Erosion Prevention-ൽ ജല വിഭവ വകുപ്പിന്റെ പങ്ക്?", options_ml: ["ഒന്നുമില്ല", "Sea wall, tetrapod, geo-tube — 590 km coast protection", "മണൽ ഖനനം", "കടലിൽ wall"], flex_fact_ml: "₹5,000 കോടി+ coastal protection — 590 km sea wall, breakwater. 10 ലക്ഷം+ ജനങ്ങൾക്ക് സുരക്ഷ." },
    12: { question_ml: "Underground Water Recharge — MAR (Managed Aquifer Recharge)?", options_ml: ["ഒന്നുമില്ല", "1,000+ recharge wells + check dams", "10 wells", "Natural recharge മാത്രം"], flex_fact_ml: "ഭൂഗർഭ ജലനിരപ്പ് 2m+ ഉയർന്നു — MAR + rain harvesting + pond restoration." },
    13: { question_ml: "Wastewater Treatment-ൽ STP (Sewage Treatment Plant)?", options_ml: ["ഒന്നുമില്ല", "30+ STP — treated water reuse", "5 STP", "Plans only"], flex_fact_ml: "Treated wastewater — കൃഷി, നിർമ്മാണം, ഫ്ലഷിംഗ്. Water circular economy." },
    14: { question_ml: "Multi-purpose Irrigation Projects?", options_ml: ["1", "3", "10+", "ഒന്നുമില്ല"], flex_fact_ml: "Kuttiyadi, Idamalayar, Pazhassi — ജലസേചനം + വൈദ്യുതി + കുടിവെള്ളം." },
    15: { question_ml: "Water Literacy Mission?", options_ml: ["ഒന്നുമില്ല", "സ്കൂളുകളിൽ ജല സാക്ഷരത + community well monitoring", "TV ad മാത്രം", "Poster campaign"], flex_fact_ml: "5 ലക്ഷം+ കുട്ടികൾ — ജല സാക്ഷരത. ജലം ലാഭിക്കൽ, മലിനീകരണം തടയൽ." }
  }
};

let translated = 0;
data.forEach(module => {
  const modTranslations = translations[module.slug];
  if (modTranslations) {
    module.questions.forEach(q => {
      const t = modTranslations[q.id];
      if (t) {
        q.question_ml = t.question_ml;
        q.options_ml = t.options_ml;
        q.flex_fact_ml = t.flex_fact_ml;
        translated++;
      }
    });
  }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`Batch 2: Translated ${translated} more questions.`);

// Count total translated
let total = 0, withMl = 0;
data.forEach(m => m.questions.forEach(q => { total++; if (q.question_ml) withMl++; }));
console.log(`Total translated: ${withMl}/${total}`);
