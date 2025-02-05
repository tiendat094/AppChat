package com.application.appchat.Management.DropboxService;

import com.dropbox.core.DbxRequestConfig;
import com.dropbox.core.v2.DbxClientV2;
import com.dropbox.core.v2.files.FileMetadata;
import com.dropbox.core.v2.sharing.SharedLinkMetadata;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
public class DropboxService {

    private final DbxClientV2 dropboxClient;

    // Constructor injection for Dropbox API Key
    public DropboxService(@Value("${dropbox.access.token}") String dropboxApiToken) {
        DbxRequestConfig config = DbxRequestConfig.newBuilder("dropbox/springboot-app").build();
        this.dropboxClient = new DbxClientV2(config, dropboxApiToken);
    }

    public String uploadFileAndGetDirectLink(String dropboxPath, InputStream inputStream, long fileSize) throws Exception {
        try {
            // Upload the file to Dropbox
            FileMetadata metadata = dropboxClient.files().uploadBuilder(dropboxPath)
                    .uploadAndFinish(inputStream);

            // Create a shared link for the file
            SharedLinkMetadata sharedLinkMetadata = dropboxClient.sharing()
                    .createSharedLinkWithSettings(metadata.getPathLower());

            // Modify the shared link to return a direct link (raw)
            String sharedLink = sharedLinkMetadata.getUrl();
            String directLink = sharedLink.replace("&dl=0", "&dl=1"); // Convert to direct link

            // Return the direct link
            return directLink;
        } catch (Exception e) {
            throw new Exception("Failed to upload file to Dropbox: " + e.getMessage(), e);
        }
    }
}


















































