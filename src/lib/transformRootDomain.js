
export default rootDomain => {
    const lang = 'Unlabelled'
    const labelRole = 'Default'
    const grid = []
    let primaryItems = [
        rootDomain
    ]
    primaryItems.push(...rootDomain.PrimaryItems)
    const maxRow =
        rootDomain.PrimaryItems.length +
        rootDomain.ContextualMemberGrid.length +
        1
    const maxCol = rootDomain.PeriodHeaders.length + 1
    for (let i = 0; i < maxRow; i++) {
        const row = []
        if (i < rootDomain.ContextualMemberGrid.length + 1) {
            for (let j = 0; j < maxCol; j++) {
                if (j === 0) {
                    if (i === 0) {
                        row.push('')
                    } else {
                        const voidCell = rootDomain.VoidQuadrant[i - 1]
                        if (voidCell.TypedDomain) {
                            if (voidCell.TypedDomain.Label[labelRole]) {
                                const langVal =
                                    voidCell.TypedDomain.Label[labelRole][lang]
                                const unlabelledVal =
                                    voidCell.TypedDomain.Label.Default
                                        .Unlabelled
                                row.push(langVal || unlabelledVal)
                            } else {
                                row.push(
                                    voidCell.TypedDomain.Label.Default
                                        .Unlabelled
                                )
                            }
                        } else {
                            if (voidCell.Dimension.Label[labelRole]) {
                                const langVal =
                                    voidCell.Dimension.Label[labelRole][lang]
                                const unlabelledVal =
                                    voidCell.Dimension.Label.Default.Unlabelled
                                row.push(langVal || unlabelledVal)
                            } else {
                                row.push(
                                    voidCell.Dimension.Label.Default.Unlabelled
                                )
                            }
                        }
                    }
                } else {
                    if (i === 0) {
                        const ph = rootDomain.PeriodHeaders[j - 1]
                        row.push(ph[lang] || ph.Unlabelled)
                    } else {
                        const memberCell =
                            rootDomain.ContextualMemberGrid[i - 1][j - 1]
                        if (memberCell.TypedMember) {
                            row.push(memberCell.TypedMember)
                        } else if (memberCell.ExplicitMember) {
                            if (memberCell.ExplicitMember.Label[labelRole]) {
                                const explicitMember = memberCell.ExplicitMember
                                const langVal =
                                    explicitMember.Label[labelRole][lang]
                                const unlabelledVal =
                                    explicitMember.Label.Default.Unlabelled
                                row.push(langVal || unlabelledVal)
                            } else {
                                row.push(
                                    memberCell.ExplicitMember.Label.Default
                                        .Unlabelled
                                )
                            }
                        } else {
                            row.push('')
                        }
                    }
                }
            }
        } else {
            const index = i - rootDomain.ContextualMemberGrid.length - 1
            for (let j = 0; j < maxCol; j++) {
                if (j === 0) {
                    const pi = primaryItems[index]
                    let label = ''
                    if (index > 0) {
                        for (let i = 0; i < pi.Level + 1; i++) {
                            label += '    '
                        }
                    }
                    if (pi.Label[labelRole]) {
                        label += pi.Label[labelRole][lang] ||
                        pi.Label.Default.Unlabelled
                    } else {
                        label += pi.Label.Default.Unlabelled
                    }
                    row.push(label)
                } else {
                    const fact = rootDomain.FactualQuadrant[index][j - 1]
                    if (fact.Unlabelled.Core) {
                        if (fact[lang]) {
                            row.push(
                                fact[lang].Head +
                                    fact[lang].Core +
                                    fact[lang].Tail
                            )
                        } else {
                            row.push(
                                fact.Unlabelled.Head +
                                    fact.Unlabelled.Core +
                                    fact.Unlabelled.Tail
                            )
                        }
                    } else if (fact.Unlabelled.InnerHtml) {
                        row.push('...')
                    } else {
                        row.push('')
                    }
                }
            }
        }
        grid.push(row)
    }
    return {
        grid,
        numFrozenRows: rootDomain.VoidQuadrant.length + 1
    }
}
