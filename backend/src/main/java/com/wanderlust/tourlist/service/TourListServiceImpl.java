package com.wanderlust.tourlist.service;

import com.wanderlust.tourlist.dto.CountryDTO;
import com.wanderlust.tourlist.dto.TourListDTO;
import com.wanderlust.tourlist.entity.City;
import com.wanderlust.tourlist.entity.Country;
import com.wanderlust.tourlist.entity.TourList;
import com.wanderlust.tourlist.repository.CityRepository;
import com.wanderlust.tourlist.repository.CountryRepository;
import com.wanderlust.tourlist.repository.TourListRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Log4j2
public class TourListServiceImpl implements TourListService {

    private final CountryRepository countryRepository;
    private final TourListRepository tourListRepository;
    private final ModelMapper modelMapper = new ModelMapper();
    private final CityRepository cityRepository;

    @Override
    public Map<String, List<String>> getContinentsCountriesCities() {
        // Fetch Join으로 모든 데이터를 가져옴
        List<Country> countries = countryRepository.findAllWithCities();

        return countries.stream()
                .collect(Collectors.groupingBy(
                        Country::getContinentName, // 대륙 이름 기준으로 그룹화
                        Collectors.mapping(country -> {
                            // 국가와 도시 데이터 매핑
                            List<String> cities = country.getCities().stream()
                                    .map(City::getCityName)
                                    .toList();
                            return country.getCountryName() + ": " + String.join(", ", cities);
                        }, Collectors.toList())
                ));
    }

    @Override
    // 대륙에 속해있는 국가 출력
    public List<CountryDTO> getCountriesByContinent(String continentName) {
        return countryRepository.getCountriesByContinent(continentName)
                .stream()
                .map(country -> modelMapper.map(country, CountryDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    // 국가와 도시 값으로 필터링 된 여행지
    public List<TourListDTO> getTourListByCountryAndCity(String countryName, String cityName) {
        // 쿼리 호출
        return tourListRepository.getByCountryAndCityWithImage(countryName, cityName)
                .stream()
                .map(record -> {

                    // DTO 생성
                    return TourListDTO.builder()
                            .tourId(((TourList) record[0]).getTourId())
                            .tourTitle(((TourList) record[0]).getTourTitle())
                            .cityName((String) record[1])
                            .cityImg((String) record[2])
                            .tourContext((String) record[3]) // 추가된 tour_context 매핑
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public Long getTourIdsByCityName(String cityName) {
        return cityRepository.findByCityName(cityName)
            .map(City::getCityId)
            .orElseThrow(() -> new EntityNotFoundException("City not found"));
    }

  @Override
  public TourListDTO getTourById(Long tourId) {
    return tourListRepository.findTourWithCityById(tourId)
        .orElseThrow(() -> new EntityNotFoundException("Tour not found with ID: " + tourId));
  }

    // 랜덤 여행지 리스트
    @Override
    public List<TourListDTO> getRandomTourList(int count) {
        // 랜덤 쿼리 호출
        List<Object[]> results = tourListRepository.findRandomTourList(count);

        // 결과 매핑 및 DTO 생성
        return results.stream()
                .map(record -> TourListDTO.builder()
                        .tourId(((Number) record[0]).longValue()) // 타입 변환
                        .tourTitle((String) record[1])
                        .tourContext((String) record[2])
                        .cityName((String) record[3])
                        .cityImg(((String) record[4]))
                        .build())
                .collect(Collectors.toList());
    }
}
