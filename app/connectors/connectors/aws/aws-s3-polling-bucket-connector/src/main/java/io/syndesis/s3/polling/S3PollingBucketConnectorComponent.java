/*
 * Copyright (C) 2016 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.syndesis.s3.polling;

import java.util.Map;

import org.apache.camel.component.connector.DefaultConnectorComponent;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

/**
 * Camel S3GetObjectConnectorComponent connector
 */
public class S3PollingBucketConnectorComponent extends DefaultConnectorComponent {

    public S3PollingBucketConnectorComponent() {
        this(null);
    }

    public S3PollingBucketConnectorComponent(String componentSchema) {
        super("aws-s3-polling-bucket-connector", componentSchema, "io.syndesis.s3.polling.S3PollingBucketConnectorComponent");
    }
    
    @Override
    protected void doStart() throws Exception {
        final Map<String, Object> options = getOptions();

            if (options.containsKey("accessKey") && options.containsKey("secretKey") && options.containsKey("region")) {
                String accessKey = (String) options.get("accessKey");
                String secretKey = (String) options.get("secretKey");
                String region = (String) options.get("region");
            	
                AWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);
                AWSCredentialsProvider credentialsProvider = new AWSStaticCredentialsProvider(credentials);
                AmazonS3 client = AmazonS3ClientBuilder.standard().withCredentials(credentialsProvider).withRegion(region).build();
                
                addOption("amazonS3Client", client);
                options.remove("accessKey");
                options.remove("secretKey");
                options.remove("region");
            } 

        super.doStart();
    }
}
