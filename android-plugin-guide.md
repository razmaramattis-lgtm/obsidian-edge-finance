# Android Native SMS Plugin – Oppsett

Etter at du har kjørt `npx cap add android` og `npx cap sync`, må du legge til en custom Capacitor-plugin for å sende SMS direkte.

## 1. Opprett plugin-filen

Opprett filen `android/app/src/main/java/app/lovable/sms/NativeSmsPlugin.java`:

```java
package app.lovable.sms;

import android.Manifest;
import android.telephony.SmsManager;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

@CapacitorPlugin(
    name = "NativeSms",
    permissions = {
        @Permission(strings = { Manifest.permission.SEND_SMS }, alias = "sms")
    }
)
public class NativeSmsPlugin extends Plugin {

    @PluginMethod
    public void sendSms(PluginCall call) {
        String phone = call.getString("phone");
        String message = call.getString("message");

        if (phone == null || message == null) {
            call.reject("Phone and message are required");
            return;
        }

        // Check permission
        if (!hasPermission("sms")) {
            requestPermissionForAlias("sms", call, "smsPermissionCallback");
            return;
        }

        doSend(call, phone, message);
    }

    @PluginMethod
    private void smsPermissionCallback(PluginCall call) {
        if (hasPermission("sms")) {
            String phone = call.getString("phone");
            String message = call.getString("message");
            doSend(call, phone, message);
        } else {
            call.reject("SMS permission denied");
        }
    }

    private void doSend(PluginCall call, String phone, String message) {
        try {
            SmsManager smsManager = SmsManager.getDefault();
            // Split long messages
            java.util.ArrayList<String> parts = smsManager.divideMessage(message);
            if (parts.size() > 1) {
                smsManager.sendMultipartTextMessage(phone, null, parts, null, null);
            } else {
                smsManager.sendTextMessage(phone, null, message, null, null);
            }
            com.getcapacitor.JSObject ret = new com.getcapacitor.JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to send SMS: " + e.getMessage());
        }
    }
}
```

## 2. Registrer pluginen

I `android/app/src/main/java/.../MainActivity.java`, legg til:

```java
import app.lovable.sms.NativeSmsPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NativeSmsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
```

## 3. Legg til tillatelse i AndroidManifest.xml

I `android/app/src/main/AndroidManifest.xml`, legg til innenfor `<manifest>`:

```xml
<uses-permission android:name="android.permission.SEND_SMS" />
```

## 4. Bygg og kjør

```bash
npx cap sync android
npx cap run android
```

Åpne `/gateway` i appen — den vil nå sende SMS direkte uten å åpne meldingsappen!
