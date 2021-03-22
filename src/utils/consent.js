import { appVersion, appInstallId, sendEvent, getDeviceLanguage } from 'utils'

const KEY = 'usage-data-consent'

export const isConsentGranted = () => {
  return localStorage.getItem(KEY) !== null
}

export const grantConsent = () => {
  const version = appVersion()
  sendEvent(
    '/analytics/legacy/kaiosappfirstrun/1.0.0',
    'eventlogging_KaiOSAppFirstRun',
    'KaiOSAppFirstRun',
    getDeviceLanguage(),
    {
      app_version: version,
      app_id: appInstallId()
    }
  )
  localStorage.setItem(KEY, JSON.stringify({
    timestamp: Date.now(),
    version
  }))
}

// Those messages are not in i18n/*.json because they have a legal
// value and are translated by legal experts.
export const consentMessages = {
  en: {
    'consent-message-policy': 'I understand and accept the terms of the Privacy Policy and consent to the processing of my personal information in accordance with such terms.',
    'consent-message-and': 'And',
    'consent-message-terms': 'I understand and accept the Terms of Service.',
    'consent-softkeys-policy': 'Policy',
    'consent-softkeys-agree': 'Agree',
    'consent-softkeys-terms': 'Terms'
  },
  hi: {
    'consent-message-policy': 'मैं निजता नीति की शर्तों को समझता और स्वीकार करता हूँ और ऐसी शर्तों के अनुसार मेरी व्यक्तिगत जानकारी के प्रसंस्करण के लिए सहमति व्यक्त करता हूँ।',
    'consent-message-and': 'और',
    'consent-message-terms': 'मैं सेवाओं की शर्तों को समझता हूँ और स्वीकार करता हूँ।',
    'consent-softkeys-policy': 'नीति',
    'consent-softkeys-agree': 'सहमत',
    'consent-softkeys-terms': 'शर्तें'
  },
  as: {
    'consent-message-policy': 'মই গোপনীয়তাৰ চৰ্তসমূহ আৰু সেইবোৰ চৰ্ত অনুসৰি মোৰ ব্যক্তিগত তথ্য প্ৰক্ৰিয়াকৰণ কৰাৰ দিশসমূহ বুজি পাইছো আৰু স্বীকাৰ কৰিছো |',
    'consent-message-and': 'আৰু',
    'consent-message-terms': 'সেৱাসমূহৰ চৰ্তসমূহ বুজি  পাইছো আৰু স্বীকাৰ কৰিছো |',
    'consent-softkeys-policy': 'পলিচি',
    'consent-softkeys-agree': 'সন্মত',
    'consent-softkeys-terms': 'চৰ্তসমূহ'
  },
  bn: {
    'consent-message-policy': 'আমি গোপনীয়তা নীতির শর্তগুলি বুঝতে পেরেছি ও সেগুলি স্বীকার করছি এবং এই শর্তগুলি অনুসারে আমার ব্যক্তিগত তথ্যের প্রক্রিয়াকরণে সম্মতি প্রদান করছি।',
    'consent-message-and': 'এবং',
    'consent-message-terms': 'আমি পরিষেবার শর্তগুলি বুঝতে পেরেছি ও স্বীকার করছি।',
    'consent-softkeys-policy': 'নীতি',
    'consent-softkeys-agree': 'সম্মত',
    'consent-softkeys-terms': 'শর্ত'
  },
  gu: {
    'consent-message-policy': 'હું ગોપનીયતા નીતિના નિયમો અને શરતો સમજુ છુ અને સ્વીકારું છુ અને આવી શરતોના અનુપાલનમાં મારી વ્યક્તિગત માહિતી ની પ્રક્રિયા કરવા માટે હું સંમતિ આપુ છુ.',
    'consent-message-and': 'અને',
    'consent-message-terms': 'હું નિયમો અને શરતો સમજુ છુ અને સ્વીકારુ છુ.',
    'consent-softkeys-policy': 'નીતિ',
    'consent-softkeys-agree': 'સંમત',
    'consent-softkeys-terms': 'શરતો'
  },
  kn: {
    'consent-message-policy': 'ನಾನು ಗೌಪ್ಯತಾ ನಿಯಮಗಳನ್ನು  ಅರ್ಥಮಾಡಿಕೊಂಡಿರುತ್ತೇನೆ ಮತ್ತು ಸ್ವೀಕರಿಸುತ್ತೇನೆ ಹಾಗೂ ಅಂತಹ ಯಾವುದೇ ನಿಯಮಗಳ ಅನುಸಾರವಾಗಿ ನನ್ನ ವಯಕ್ತಿಕ ಮಾಹಿತಿಯ ಪ್ರಕ್ರಿಯೆಗೆ ಸಹ ಅನುಮತಿಯನ್ನು ನೀಡಿರುತ್ತೇನೆ.',
    'consent-message-and': 'ಮತ್ತು',
    'consent-message-terms': 'ನಾನು ಸೇವೆಗಳ ನಿಯಮಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡಿರುತ್ತೇನೆ ಮತ್ತು ಸ್ವೀಕರಿಸುತ್ತೇನೆ.',
    'consent-softkeys-policy': 'ನೀತಿ',
    'consent-softkeys-agree': 'ಒಪ್ಪುತ್ತೇನೆ',
    'consent-softkeys-terms': 'ನಿಯಮಗಳು'
  },
  ks: {
    'consent-message-policy': 'رازداری کی پالیسی کی شرائط کو میں سمجھتا ہوں اور قبول کرتا ہوں اور اس طرح کی شرائط کے مطابق اپنی ذاتی معلومات کے پروسیسنگ کے لئے رضامند ہوں۔',
    'consent-message-and': 'اور',
    'consent-message-terms': 'خدمات کی شرائط کو میں سمجھتا ہوں اور قبول کرتا ہوں۔',
    'consent-softkeys-policy': 'پالیسی',
    'consent-softkeys-agree': 'متفق چھُس',
    'consent-softkeys-terms': 'شرائط'
  },
  ml: {
    'consent-message-policy': 'ഞാൻ സ്വകാര്യത നയത്തിന്റെ നിബന്ധകൾ  മനസിലാക്കുകയും അംഗീകരിക്കുകയും ചെയ്യുന്നു, കൂടാതെ ഇത്തരം നിബന്ധകൾക്ക് വിധേയമായി എന്റെ വ്യക്തിഗത വിവരങ്ങൾ ഉപയോഗിക്കുന്നതിനു അനുമതി നൽകുകയും ചെയ്യുന്നു.',
    'consent-message-and': 'കൂടാതെ',
    'consent-message-terms': 'ഞാൻ സേവനങ്ങൾക്കായുള്ള വ്യവസ്ഥകൾ മനസിലാക്കുകയും സമ്മതിക്കുകയും ചെയ്യുന്നു.',
    'consent-softkeys-policy': 'നയം',
    'consent-softkeys-agree': 'സമ്മതിക്കുന്നു',
    'consent-softkeys-terms': 'വ്യവസ്ഥകൾ'
  },
  mr: {
    'consent-message-policy': 'मी गोपनीयता धोरणाच्या अटी समजतो आणि स्वीकारतो आणि अशा अटींनुसार माझ्या वैयक्तिक माहितीचा वापर करण्याची परवानगी देतो.',
    'consent-message-and': 'आणि',
    'consent-message-terms': 'मी सेवेसंबधीच्या अटी समजतो आणि स्वीकारतो.',
    'consent-softkeys-policy': 'धोरण',
    'consent-softkeys-agree': 'सहमत',
    'consent-softkeys-terms': 'अटी'
  },
  ne: {
    'consent-message-policy': 'म गोपनीयता नीतिको सर्तहरू बुझ्छु र स्वीकार गर्छु र त्यस्ता सर्तहरू अनुसार मेरो व्यक्तिगत जानकारीको प्रशोधनको कार्य गर्छ।',
    'consent-message-and': 'र',
    'consent-message-terms': 'मैले बुझेँ र सेवाका सर्तहरू स्वीकार गर्छु।',
    'consent-softkeys-policy': 'नीति',
    'consent-softkeys-agree': 'सहमत',
    'consent-softkeys-terms': 'सर्तहरू'
  },
  or: {
    'consent-message-policy': 'ମୁଁ ଗୋପନୀୟତା ନୀତିର ସର୍ତ୍ତାବଳି ବୁଝିଛି ଏବଂ ସ୍ୱୀକାର କରୁଛି ଏବଂ ଏପରି ସର୍ତ୍ତାବଳି ଅନୁଯାୟୀ  ମୋର ବ୍ୟକ୍ତିଗତ ସୂଚନା ପ୍ରକ୍ରିୟାକରଣ  ପାଇଁ ସମ୍ମତି ଦେଉଛି|',
    'consent-message-and': 'ଏବଂ',
    'consent-message-terms': 'ମୁଁ ସେବାର ସର୍ତ୍ତାବଳି ବୁଝିଛି ଏବଂ ସ୍ୱୀକାର କରୁଛି|',
    'consent-softkeys-policy': 'ନୀତି',
    'consent-softkeys-agree': 'ସମ୍ମତ',
    'consent-softkeys-terms': 'ଅବଧି'
  },
  pa: {
    'consent-message-policy': 'ਮੈਂ ਪਰਦੇਦਾਰੀ ਨੀਤੀ ਦੀਆਂ ਸ਼ਰਤਾਂ ਨੂੰ ਸਮਝਦਾ ਅਤੇ ਸਵੀਕਾਰ ਕਰਦਾ ਹਾਂ ਅਤੇ ਇਹਨਾਂ ਸ਼ਰਤਾਂ ਦੇ ਅਧੀਨ ਆਪਣੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ \'ਤੇ ਪ੍ਰੀਕਿਰਿਆ ਕਰਨ ਨਾਲ ਸਹਿਮਤੀ ਪ੍ਰਗਟਾਉਂਦਾ ਹਾਂ।',
    'consent-message-and': 'ਅਤੇ',
    'consent-message-terms': 'ਮੈਂ ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ ਨੂੰ  ਸਮਝਦਾ ਅਤੇ ਸਵੀਕਾਰ ਕਰਦਾ ਹਾਂ।',
    'consent-softkeys-policy': 'ਨੀਤੀ',
    'consent-softkeys-agree': 'ਸਹਿਮਤ',
    'consent-softkeys-terms': 'ਸ਼ਰਤਾਂ'
  },
  sa: {
    'consent-message-policy': 'अहं गुप्त्नीतिनाम् जानामि स्वीकारम् च् करोमि तथा नियमानुसारं मह्यं व्यक्तिकं सूचनानाम प्रसंसकरणाय सहमतिं च ददामि |',
    'consent-message-and': 'तथा',
    'consent-message-terms': 'अहं सेवानां नियमान् सम्यकतया जानामि स्वीकारम्  च करोमि |',
    'consent-softkeys-policy': 'नीति',
    'consent-softkeys-agree': 'अङ्गीकारः',
    'consent-softkeys-terms': 'प्रबन्धनम्'
  },
  sd: {
    'consent-message-policy': 'مان رازداري جي پاليسي جي شرائط کي سمجھان ٿو ۽ قبول ڪريان ٿو ۽ ان طرح جي شرائط جي مطابق پنهجي ذاتي معلومات جي ڪاروائي تي مطفق آهيان.',
    'consent-message-and': '۽',
    'consent-message-terms': 'مان خدمات جي شرطن کي سمجھان ٿو ۽ قبول ڪيان ٿو.',
    'consent-softkeys-policy': 'اصول',
    // 'consent-softkeys-agree': '',
    'consent-softkeys-terms': 'شرائط'
  },
  ta: {
    'consent-message-policy': 'தனியுரிமைக் கொள்கையின் விதிமுறைகளை நான் புரிந்துகொண்டேன் மற்றும் ஏற்றுக்கொள்கிறேன் மேலும் அத்தகைய விதிமுறைகளுக்கு ஏற்ப என் தனிப்பட்ட தகவலை செயல்முறைப்படுத்த இசைவளிக்கிறேன்',
    'consent-message-and': 'மேலும்',
    'consent-message-terms': 'சேவை விதிமுறைகளை நான் புரிந்துகொண்டேன் மற்றும் ஒப்புக்கொள்ளுகிறேன்',
    'consent-softkeys-policy': 'கொள்கை',
    'consent-softkeys-agree': 'உடன்படு',
    'consent-softkeys-terms': 'விதிமுறைகள்'
  },
  te: {
    'consent-message-policy': 'గోప్యతా విధానం  నిబంధనలను నేను అర్థం చేసుకున్నాను, అంగీకరిస్తున్నాను మరియు అలాంటి నిబంధనలకు అనుగుణంగా నా వ్యక్తిగత సమాచారం ప్రాసెసింగ్‌పై దృష్టి పెడతాను.',
    'consent-message-and': 'మరియు',
    'consent-message-terms': 'నేను సేవా నిబంధనలను అర్థం చేసుకున్నాను మరియు అంగీకరిస్తున్నాను.',
    'consent-softkeys-policy': 'పాలసీ',
    'consent-softkeys-agree': 'ఒప్పుకుంటున్నాను',
    'consent-softkeys-terms': 'నిబంధనలు'
  },
  brx: {
    'consent-message-policy': 'आं बुजियो आरो निजोमथि बिथांखिनि रादाय फोरखौ गनायो आरो आंनि गावारि फोरमायथिखौ बे रादायफोरनि गेजेरजों बाहायनायाव आंनि गनायथिखौ होयो।',
    'consent-message-and': 'आरो',
    'consent-message-terms': 'आं बुजियो आरो सिबिथाइफोरनि रादायफोरखौ गनायनानै लायो।',
    'consent-softkeys-policy': 'बिथांखि',
    'consent-softkeys-agree': 'राजि जानाय',
    'consent-softkeys-terms': 'रादायफोर'
  },
  mai: {
    'consent-message-policy': 'हम गोपनीयत नीति के नियम सभ् आओर  एहि नियम सभ केंं अनुसार निजी जानकारीक प्राेसेसिंग सँ संबंधित सरोकार कें बुझै छी आ एकरा स्वीकार करै छी।',
    'consent-message-and': 'आओर',
    'consent-message-terms': 'हम सेवा के नियम सभ बुझै छी आ एकरा स्वीकार करै छी ।',
    'consent-softkeys-policy': 'नीति',
    'consent-softkeys-agree': 'स्वीकार करब',
    'consent-softkeys-terms': 'नियम सभ'
  },
  gom: {
    'consent-message-policy': 'म्हाका गुप्तताय धोरणाच्यो अटी समजल्यात आनी हांव त्यो स्विकारता आनी  तश्या अटींच्या अनुशंगान म्हज्या व्यक्तिगत म्हायतीच्या प्रक्रियेक मंजुरी दिता.',
    'consent-message-and': 'आनी',
    'consent-message-terms': 'म्हाका सेवेच्यो अटी समजल्यात आनी हांव त्यो स्विकारता.',
    'consent-softkeys-policy': 'धोरण',
    'consent-softkeys-agree': 'मान्य',
    'consent-softkeys-terms': 'अटी'
  },
  bpy: {
    'consent-message-policy': 'ঐহাক প্রাইবেসি পোলিসিগী তার্মশিং খঙঙি অমসুং য়াই অমসুং মসিগুম্বা তার্মশিং অসিগী মতুং ইন্না ঐহাক ইশাগী ই-পাও প্রোসেস তৌবদা অয়াবা পীরি।',
    'consent-message-and': 'অমসুং',
    'consent-message-terms': 'ঐহাক সার্ভিসশিং অসিগী তার্মশিং খঙঙি অমসুং য়াই।',
    'consent-softkeys-policy': 'পোলিসি',
    'consent-softkeys-agree': 'য়াবা',
    'consent-softkeys-terms': 'তার্মশিং'
  },
  doi: {
    'consent-message-policy': 'में निजता पालिसी दी शर्तें गी समझनां ते मंजूर करनां ते इ’नें शर्तें दे अनुसार अपनी निजी जानकारी गी प्रोसेस करने लेई रजामंदी दिन्नां।',
    'consent-message-and': 'ते',
    'consent-message-terms': 'में सेवाएं दी शर्तें गी समझनां ते मंजूर करनां।',
    'consent-softkeys-policy': 'पालिसी',
    'consent-softkeys-agree': 'मंजूर',
    'consent-softkeys-terms': 'शर्तां'
  },
  ur: {
    'consent-message-policy': '.میں رازداری کی پالیسی کی شرائط کو سمجھتا اور قبول کرتا ہوں اور اس طرح کے شرائط کے مطابق اپنی ذاتی معلومات کی پروسیسنگ کے لئے پرکار ہوں',
    'consent-message-and': 'اور',
    'consent-message-terms': 'میں خدمات کی شرائط کو سمجھتا ہوں اور قبول کرتا ہوں',
    'consent-softkeys-policy': 'پالیسی',
    'consent-softkeys-agree': 'راضی',
    'consent-softkeys-terms': 'شرائط'
  }
}
