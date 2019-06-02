import sys
import time
import hashlib
from pyfingerprint.pyfingerprint import PyFingerprint

sensorId = sys.argv[1];

time.sleep(5)

while True:
    try:
        f = PyFingerprint('/dev/serial/by-id/'+sensorId, 57600, 0xFFFFFFFF, 0x00000000)

        if ( f.verifyPassword() == False ):
            raise ValueError('The given fingerprint sensor password is wrong!')

        while True:
            print('ready')
            sys.stdout.flush()

            while ( f.readImage() == False ):
                pass

            f.convertImage(0x01)
            result = f.searchTemplate()
            positionNumber = result[0]

            if ( positionNumber == -1 ):
                print('unknown')
                sys.stdout.flush()
                time.sleep(2)
            else:
                print(positionNumber)
                sys.stdout.flush()
                time.sleep(3)

    except Exception as e:
        print('error')
        sys.stdout.flush()
        time.sleep(5)
