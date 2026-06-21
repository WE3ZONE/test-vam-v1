import { Ticket } from './types';

export const mockTicketsData: Ticket[] = [
  {
    id: 'TK-1024',
    userId: 'u-demo',
    subject: 'مشکل در واریز وجه به حساب واسط',
    category: 'مالی',
    status: 'open',
    priority: 'high',
    date: '۱۴۰۳/۰۳/۱۵',
    messages: [
      { sender: 'user', text: 'سلام، من مبلغ ۲۰ میلیون تومان رو واریز کردم ولی هنوز وضعیت تراکنش تغییر نکرده.', time: '۱۰:۳۲' },
      { sender: 'support', text: 'سلام، وقت بخیر. شناسه تراکنش شما بررسی شد. واریز شما ظرف ۲ ساعت آینده تایید خواهد شد.', time: '۱۱:۱۵' },
      { sender: 'user', text: 'ممنون، منتظر هستم.', time: '۱۱:۲۰' },
      { sender: 'support', text: 'واریز شما تایید شد و وضعیت تراکنش به "در حال انتقال" تغییر کرد. با تشکر از صبر شما.', time: '۱۲:۴۵' },
    ],
  },
  {
    id: 'TK-1019',
    userId: 'u-demo',
    subject: 'درخواست تغییر شماره شبا',
    category: 'حساب کاربری',
    status: 'closed',
    priority: 'medium',
    date: '۱۴۰۳/۰۳/۱۰',
    messages: [
      { sender: 'user', text: 'لطفا شماره شبای حسابم رو تغییر بدید. شماره جدید: IR120560...', time: '۰۹:۰۰' },
      { sender: 'support', text: 'تغییر شبا انجام شد. لطفا از بخش اطلاعات هویتی تایید کنید.', time: '۱۴:۳۰' },
    ],
  },
  {
    id: 'TK-1031',
    userId: 'u3',
    subject: 'آگهی من رد شده — دلیل چیست؟',
    category: 'آگهی',
    status: 'in_progress',
    priority: 'medium',
    date: '۱۴۰۳/۰۳/۱۴',
    messages: [
      { sender: 'user', text: 'آگهی وام رسالت من رد شده. دلیل چی بوده؟ مدارکم کامل بود.', time: '۱۵:۰۰' },
      { sender: 'support', text: 'سلام. آگهی شما به دلیل ناخوانا بودن تصویر امتیاز وام رد شده. لطفا تصویر واضح‌تری آپلود کنید.', time: '۱۶:۳۰' },
      { sender: 'system', text: 'وضعیت تیکت به "در حال بررسی" تغییر یافت.', time: '۱۶:۳۱' },
    ],
  },
];
