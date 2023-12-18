import { Scheduler } from "@aldabil/react-scheduler"
import React from "react"
import { supabase } from "../../supabaseClient"

export default function App() {
    const fetchRemote = async () => {
        try {
            // Fetch data from the 'schedule' table in Supabase
            const { data, error } = await supabase.from('schedule').select('*');

            if (error) {
                throw error;
            } else {
                // Map Supabase data to the desired format
                const mappedData = data.map((item) => {
                    return {
                        event_id: item.id,
                        title: item.title,
                        start: new Date(item.start_date),
                        end: new Date(item.end_date),
                    };
                });

                console.log('Remote data fetched successfully:', mappedData);
                return mappedData;
            }
        } catch (error) {
            console.error('Error fetching remote data from Supabase:', error);
            throw error;
        }
    };

    const handleConfirm = async (event, action) => {
        console.log("handleConfirm =", action, event.title, event.start, event.end)

        return new Promise((res, rej) => {
            if (action === "edit") {
                console.log("Sucessful edit")
                updateEventsIntoSupabase(event)
            } else if (action === "create") {
                console.log("Sucessful create")
                insertEventsIntoSupabase(event);
            }

            const isFail = Math.random() > 0.9;
            // Make it slow just for testing
            setTimeout(() => {
                if (isFail) {
                    rej("Ops... Faild");
                } else {
                    res({
                        ...event,
                        event_id: event.event_id || Math.random()
                    });
                }
            }, 3000);
        })
    }

    const handleDelete = async (deletedId) => {
        try {
            // Simulate http request: return the deleted id after a delay
            await new Promise((resolve) => setTimeout(resolve, 3000));

            // Simulate deletion from Supabase
            // Replace the following line with your actual Supabase deletion logic
            const { data, error } = await supabase.from('schedule').delete().eq('id', deletedId);

            if (error) {
                throw error;
            } else {
                console.log('Event deleted successfully:', data);
                return deletedId;
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    };

    async function insertEventsIntoSupabase(event) {
        try {
            const { data, error } = await supabase
                .from('schedule')
                .insert([
                    {
                        title: event.title,
                        start_date: event.start,
                        end_date: event.end,
                    },
                ]);

            if (error) {
                throw error;
            } else {
                console.log('Event inserted successfully:', data);
            }
        } catch (error) {
            console.error('Error inserting event into Supabase:', error);
            throw error;
        }
    }

    async function updateEventsIntoSupabase(event) {
        try {
            const { data, error } = await supabase
                .from('schedule')
                .update([
                    {
                        id: event.event_id,
                        title: event.title,
                        start_date: event.start,
                        end_date: event.end,
                    },
                ])
                .eq('id', event.event_id);

            if (error) {
                throw error;
            } else {
                console.log('Event update successfully:', data);
            }
        } catch (error) {
            console.error('Error updating event into Supabase:', error);
            throw error;
        }
    }


    return (
        <Scheduler
            getRemoteEvents={fetchRemote}
            onConfirm={handleConfirm}
            onDelete={handleDelete}
            view="month"
            disableViewNavigator={true}
        />
    )
}
