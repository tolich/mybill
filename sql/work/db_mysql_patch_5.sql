/*
 * Все данные полей pricein priceout
 * переводит в юниты (x1024x1024)
 */
 
# update intariffs set pricein=pricein*1024*1024, priceout=priceout*1024*1024;
 update tariffs set monthlyfee=monthlyfee*1024*1024;