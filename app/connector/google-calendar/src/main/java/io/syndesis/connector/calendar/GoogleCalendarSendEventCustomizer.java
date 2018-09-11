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
package io.syndesis.connector.calendar;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.component.google.calendar.internal.CalendarEventsApiMethod;
import org.apache.camel.component.google.calendar.internal.GoogleCalendarApiCollection;
import org.apache.camel.util.ObjectHelper;

import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.common.base.Splitter;

import io.syndesis.integration.component.proxy.ComponentProxyComponent;
import io.syndesis.integration.component.proxy.ComponentProxyCustomizer;

public class GoogleCalendarSendEventCustomizer implements ComponentProxyCustomizer {

    private String description;
    private String summary;
    private String calendarId;
    private String attendees;


    @Override
    public void customize(ComponentProxyComponent component, Map<String, Object> options) {
        setApiMethod(options);
        component.setBeforeProducer(this::beforeProducer);
    }

    private void setApiMethod(Map<String, Object> options) {
        description = (String) options.get("description");
        summary = (String) options.get("summary");
        calendarId = "primary";
        attendees = (String) options.get("attendees");
        options.put("apiName",
        		GoogleCalendarApiCollection.getCollection().getApiName(CalendarEventsApiMethod.class).getName());
        options.put("methodName", "insert");
    }

    private void beforeProducer(Exchange exchange) throws MessagingException, IOException {

        final Message in = exchange.getIn();
        Event event;
        event = exchange.getIn().getBody(Event.class);
        if (event == null) {
        	event = new Event();

            if (ObjectHelper.isNotEmpty(summary)) {
                event.setSummary(summary);
            }
            if (ObjectHelper.isNotEmpty(description)) {
            	event.setDescription(description);
            }
            if (ObjectHelper.isNotEmpty(attendees)) {
                event.setAttendees(getAttendeesList(attendees));
            }
            Date startDate = new Date();
            Date endDate = new Date(startDate.getTime() + 3600000);
            DateTime start = new DateTime(startDate, TimeZone.getTimeZone("UTC"));
            event.setStart(new EventDateTime().setDateTime(start));
            DateTime end = new DateTime(endDate, TimeZone.getTimeZone("UTC"));
            event.setEnd(new EventDateTime().setDateTime(end));

        }

        in.setHeader("CamelGoogleCalendar.content", event);
        in.setHeader("CamelGoogleCalendar.calendarId", calendarId);
    }

    private List<EventAttendee> getAttendeesList(String attendeesString) throws AddressException {
        List<String> list = Splitter.on(',').splitToList(attendeesString);
        List<EventAttendee> attendeesList = new ArrayList<EventAttendee>();
        for (String string : list) {
			EventAttendee attendee = new EventAttendee();
			attendee.setEmail(string);
			attendeesList.add(attendee);
		}
        return attendeesList;
    }
}
