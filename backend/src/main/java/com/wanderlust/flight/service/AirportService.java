package com.wanderlust.flight.service;

import com.wanderlust.flight.entity.Airport;
import com.wanderlust.flight.repository.AirportRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.Map;

@Service
public class AirportService {
    @Autowired
    private AirportRepository airportRepository;

    public void deleteAllAirports() {
        airportRepository.deleteAll();
    }

    public void processAirportsData(String jsonData) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(jsonData);
        JsonNode airportsNode = rootNode;

        if (airportsNode.isObject()) {
            Iterator<Map.Entry<String, JsonNode>> fields = airportsNode.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> field = fields.next();
                Airport airport = new Airport();
                airport.setAirport_code(field.getKey());
                airport.setAirport_name(field.getValue().asText());

                airportRepository.save(airport);
            }
        }
    }
}
