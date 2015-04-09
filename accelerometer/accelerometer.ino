#include <Wire.h> 
#include <SFE_MMA8452Q.h> 

float previousX=0;
float previousY=0;
float previousZ=0;
int count = 0 ;
int resetCount = 0;

MMA8452Q accel;


void setup()
{
                                    Serial.begin(9600);

  accel.init();

}


void loop()
{

  if (accel.available())
  {
    
    delay(100);
    accel.read();

    
     if(abs((previousX-accel.cx))>0.08 ||abs( (previousY-accel.cy))>0.08 || abs((previousZ-accel.cz))>0.08){
    
         count++;
         if(count >= 20){
           Serial.print("PERSON WAKES UP");
           count = 0;
         }
    }else{
      
      resetCount++;
      if(resetCount >= 20){
      count = 0;
      resetCount = 0;
      
        }
    } 
    
      
    previousX = accel.cx;
    previousY = accel.cy;
    previousZ = accel.cz;
    }
}

