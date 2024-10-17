export const calculateDifference = (date: string | Date) => {
    const currentDate = new Date();
    const consultationDate = new Date(date);
    return Math.ceil((consultationDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
  };
  
  export const formatDate = (date: Date) =>
    date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric', year: 'numeric' });
  