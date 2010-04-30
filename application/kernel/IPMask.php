   1.
      <?php
   2.
       
   3.
      $ip = "10.0.0.1";
   4.
      $network = "10.0.0.0";
   5.
      $netmask = "255.255.255.248";
   6.
       
   7.
      if (ipofnet($ip,$network,$netmask))
   8.
      {
   9.
          echo "Адрес $ip принадлежит сети $network/".mask2cidr($netmask)."\n";
  10.
      }
  11.
      else
  12.
      {
  13.
          echo "Адрес $ip не принадлежит сети $network/".mask2cidr($netmask)."\n";
  14.
      };
  15.
       
  16.
      function ipofnet($ip,$network,$mask)
  17.
      {
  18.
         if (((ip2long($ip))&(ip2long($mask)))==ip2long($network)) return 1;
  19.
         return 0;
  20.
      };
  21.
       
  22.
      function cidr2mask($mask)
  23.
      {
  24.
          return long2ip(pow(2,32) - pow(2, (32-$mask)));
  25.
      };
  26.
       
  27.
      function mask2cidr($mask)
  28.
      {
  29.
          $a=strpos(decbin(ip2long($mask)),"0");
  30.
          if (!$a){$a=32;}
  31.
          return $a;
  32.
      };
  33.
       
  34.
      ?>

