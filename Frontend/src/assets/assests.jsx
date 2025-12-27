export const apiService = {
    async getFAQs() {
    // TODO: Replace with actual API call
    // return apiClient.get('/public/faqs');
    
    // Mock implementation
    return [
      {
        id: '1',
        question: 'How do I enroll in a course?',
        answer: 'Simply browse our courses, select the one you want, and click the "Enroll Now" button. You\'ll be guided through the payment process.',
      },
      {
        id: '2',
        question: 'Can I access courses on mobile?',
        answer: 'Yes! Our platform is fully responsive and works perfectly on mobile devices, tablets, and desktops.',
      },
      
      {
        id: '4',
        question: 'Do I get a certificate after completing a course?',
        answer: 'Yes! Upon successful completion of any course, you\'ll receive a certificate that you can share on LinkedIn and other professional networks.',
      },
      {
        id: '5',
        question: 'How long do I have access to course materials?',
        answer: 'You have lifetime access to all course materials, including future updates and additional content.',
      },
      {
        id: '6',
        question: 'Can I learn at my own pace?',
        answer: 'Absolutely! All our courses are self-paced, so you can learn whenever it\'s convenient for you.',
      },
    ];
  },
}