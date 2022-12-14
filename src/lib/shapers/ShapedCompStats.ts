import { ValorantTierEmojis } from '../../Constants';
import type { MMRDataV2, Season } from '../types/types';

export default class ShapedCompStats {
	public raw!: MMRDataV2;
	private rawPeakSeason!: Season;
	public readonly peakSeason!: {
		rank: {
			name: string;
			id: number;
			discordEmoji: string;
		};
		wins: number;
		games: number;
	};
	public readonly currentRating!: {
		rank: {
			name: string;
			id: number;
			elo: number;
			discordEmoji: string;
		};
		wins: number;
		games: number;
		placementGamesLeft: number;
		rrChangeToLastGame: string | number;
	};

	public constructor(raw: MMRDataV2) {
		this.raw = raw;
		this.rawPeakSeason = this.getPeakSeason();
		this.peakSeason = {
			rank: {
				name: this.rawPeakSeason.final_rank_patched,
				id: this.rawPeakSeason.final_rank,
				discordEmoji: this.getCompTierEmoji(this.rawPeakSeason.final_rank_patched),
			},
			wins: this.rawPeakSeason.wins,
			games: this.rawPeakSeason.number_of_games,
		};
		this.currentRating = {
			rank: {
				name: this.raw.current_data.currenttierpatched,
				id: this.raw.current_data.currenttier,
				elo: this.raw.current_data.elo,
				discordEmoji: this.getCompTierEmoji(this.raw.current_data.currenttierpatched),
			},
			wins: this.raw.current_data.ranking_in_tier,
			games: this.raw.current_data.games_needed_for_rating,
			placementGamesLeft: this.raw.current_data.games_needed_for_rating,
			rrChangeToLastGame:
				this.raw.current_data.mmr_change_to_last_game > 0
					? `+${this.raw.current_data.mmr_change_to_last_game}`
					: this.raw.current_data.mmr_change_to_last_game,
		};
	}

	/**
	 * Find the Season the player had the highest final_rank and return the season
	 */
	private getPeakSeason(): Season {
		let peakSeason: Season = {
			wins: 0,
			number_of_games: 0,
			final_rank: 0,
			final_rank_patched: '',
			act_rank_wins: [],
		};

		for (const season in this.raw.by_season) {
			if (this.raw.by_season[season]!.final_rank > peakSeason.final_rank) {
				peakSeason = this.raw.by_season[season]!;
			}
		}

		return peakSeason;
	}

	/**
	 * Returns the emoji for the given tier
	 * @param tier The tier to get the emoji for in the form of "Iron 1"
	 * @returns A Discord emoji string if the emojis is found, otherwise the original string is returned
	 * @example ```js
	 * getEmojiForTier("Iron 1")
	 * // => "<:iron_1:971675215203553320>"
	 * ```
	 */
	private getCompTierEmoji(tier: string): string {
		return `<:${
			ValorantTierEmojis.find((e) => e.name === tier.toLowerCase().replaceAll(' ', '_'))?.identifier ??
			tier.toLowerCase().replaceAll(' ', '_')
		}>`;
	}
}
