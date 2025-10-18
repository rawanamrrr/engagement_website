import { useLanguage } from '@/contexts/LanguageContext';

type TranslationKey = 
  | 'loading'
  | 'ourSpecialDay'
  | 'countingMoments'
  | 'joinUsAt'
  | 'date'
  | 'time'
  | 'location'
  | 'rsvpTitle'
  | 'rsvpDescription'
  | 'rsvpButton'
  | 'rsvpFormTitle'
  | 'rsvpFormName'
  | 'rsvpFormEmail'
  | 'rsvpFormGuests'
  | 'rsvpFormSubmit'
  | 'rsvpSuccess'
  | 'rsvpError'
  | 'muteMusic'
  | 'unmuteMusic'
  | 'venueMapTitle'
  | 'venueMapLoading'
  | 'venueMapError'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'writeUsMessage'
  | 'writeUsDescription'
  | 'yourName'
  | 'yourMessage'
  | 'clearDrawing'
  | 'sendMessage'
  | 'messageSent'
  | 'messageError'
  | 'footerMessage'
  | 'sendingMessage'
  | 'color'
  | 'width'
  | 'colorBlack'
  | 'colorRed'
  | 'colorBlue'
  | 'colorGreen'
  | 'colorPurple'
  | 'colorOrange'
  | 'widthThin'
  | 'widthMedium'
  | 'widthThick'
  | 'widthBold'
  | 'current'
  | 'size'
  | 'copyright';

type Translations = {
  [key in TranslationKey]: {
    en: string;
    ar: string;
  };
};

export const translations: Translations = {
  loading: {
    en: 'Loading invitation...',
    ar: 'جاري تحميل الدعوة...',
  },
  ourSpecialDay: {
    en: 'Our Special Day',
    ar: 'يومنا الخاص',
  },
  countingMoments: {
    en: 'Counting every moment until we celebrate together',
    ar: 'نعد كل لحظة حتى نحتفل معاً',
  },
  joinUsAt: {
    en: 'Join Us At',
    ar: 'نلتقي في',
  },
  date: {
    en: 'November 7, 2025',
    ar: '٧ نوفمبر ٢٠٢٥',
  },
  time: {
    en: '7:00 PM',
    ar: '٧:٠٠ مساءً',
  },
  location: {
    en: 'Diva Garden Hall, Talkha City',
    ar: 'قاعة ديفا جاردن، طلخا',
  },
  rsvpTitle: {
    en: 'Will You Join Us?',
    ar: 'هل ستنضم إلينا؟',
  },
  rsvpDescription: {
    en: 'We would be honored to have you celebrate with us on our special day',
    ar: 'سيكون لنا الشرف بوجودكم معنا في يومنا الخاص',
  },
  rsvpButton: {
    en: 'RSVP Now',
    ar: 'تأكيد الحضور',
  },
  rsvpFormTitle: {
    en: 'RSVP Form',
    ar: 'نموذج تأكيد الحضور',
  },
  rsvpFormName: {
    en: 'Your Name',
    ar: 'الاسم',
  },
  rsvpFormEmail: {
    en: 'Email Address',
    ar: 'البريد الإلكتروني',
  },
  rsvpFormGuests: {
    en: 'Number of Guests',
    ar: 'عدد الضيوف',
  },
  rsvpFormSubmit: {
    en: 'Submit',
    ar: 'إرسال',
  },
  rsvpSuccess: {
    en: 'Thank you for your RSVP!',
    ar: 'شكراً لتأكيد حضوركم!',
  },
  rsvpError: {
    en: 'Please fill in all fields',
    ar: 'الرجاء ملء جميع الحقول',
  },
  muteMusic: {
    en: 'Mute background music',
    ar: 'كتم الموسيقى',
  },
  unmuteMusic: {
    en: 'Unmute background music',
    ar: 'إعادة تشغيل الموسيقى',
  },
  venueMapTitle: {
    en: 'Venue Location',
    ar: 'موقع القاعة',
  },
  venueMapLoading: {
    en: 'Loading map...',
    ar: 'جاري تحميل الخريطة...',
  },
  venueMapError: {
    en: 'Failed to load map',
    ar: 'فشل تحميل الخريطة',
  },
  days: {
    en: 'Days',
    ar: 'أيام',
  },
  hours: {
    en: 'Hours',
    ar: 'ساعات',
  },
  minutes: {
    en: 'Minutes',
    ar: 'دقائق',
  },
  seconds: {
    en: 'Seconds',
    ar: 'ثواني',
  },
  writeUsMessage: {
    en: 'Write Us a Message',
    ar: 'اكتبوا لنا رسالة',
  },
  writeUsDescription: {
    en: 'Leave us a handwritten note or message',
    ar: 'اتركوا لنا رسالة بخط اليد',
  },
  yourName: {
    en: 'Your Name',
    ar: 'اسمك',
  },
  yourMessage: {
    en: 'Your Message',
    ar: 'رسالتك',
  },
  clearDrawing: {
    en: 'Clear',
    ar: 'مسح',
  },
  sendMessage: {
    en: 'Send Message',
    ar: 'إرسال الرسالة',
  },
  messageSent: {
    en: 'Message sent successfully!',
    ar: 'تم إرسال الرسالة بنجاح!',
  },
  messageError: {
    en: 'Please enter your name and write a message',
    ar: 'الرجاء إدخال الاسم وكتابة رسالة',
  },
  footerMessage: {
    en: "We can't wait to celebrate with you",
    ar: 'لا يمكننا الانتظار للاحتفال معكم',
  },
  sendingMessage: {
    en: 'Sending your message...',
    ar: 'جاري إرسال رسالتك...',
  },
  color: {
    en: 'Color',
    ar: 'اللون',
  },
  width: {
    en: 'Width',
    ar: 'السُمك',
  },
  colorBlack: {
    en: 'Black',
    ar: 'أسود',
  },
  colorRed: {
    en: 'Red',
    ar: 'أحمر',
  },
  colorBlue: {
    en: 'Blue',
    ar: 'أزرق',
  },
  colorGreen: {
    en: 'Green',
    ar: 'أخضر',
  },
  colorPurple: {
    en: 'Purple',
    ar: 'بنفسجي',
  },
  colorOrange: {
    en: 'Orange',
    ar: 'برتقالي',
  },
  widthThin: {
    en: 'Thin',
    ar: 'رفيع',
  },
  widthMedium: {
    en: 'Medium',
    ar: 'متوسط',
  },
  widthThick: {
    en: 'Thick',
    ar: 'سميك',
  },
  widthBold: {
    en: 'Bold',
    ar: 'عريض',
  },
  current: {
    en: 'Current',
    ar: 'الحالي',
  },
  size: {
    en: 'Size',
    ar: 'الحجم',
  },
  copyright: {
    en: 'All Rights Reserved. Made by',
    ar: 'جميع الحقوق محفوظة. صنع بواسطة',
  },
};

export function useTranslation() {
  const { language } = useLanguage();
  
  return function t(key: TranslationKey): string {
    return translations[key][language];
  };
}