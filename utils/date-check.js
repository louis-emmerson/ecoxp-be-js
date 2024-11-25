module.exports = dateCheck = (date)=>{
  const dateRegex = /^\d{4,4}-\d{1,2}-\d{1,2}$/;
  return dateRegex.test(date)
}